import _ from 'lodash';
import { GAME_CONSTANTS, SOCKET, VIRTUAL_PLAYER_NAMES } from '../../constants';
import { IGameroomMetadata } from '../../interfaces/IGameroomMetadata';
import { IPair } from '../../interfaces/IPair';
import { IStatsHistory } from '../../interfaces/IStatsHistory';
import { ITurnInfo } from '../../interfaces/ITurnInfo';
import { Game } from './Game';

export class GameSprint extends Game {
    nAttemptsLeft = 0;
    score = 0;
    endTimestamp = 0;
    virtualPlayer = '';
    humainPlayers: string[] = [];
    channelName: string;
    startTime = 0;
    endTime = 0;
    difficulty = 0;
    lastPair: IPair | undefined;

    turnTimeout: NodeJS.Timeout | undefined;
    messageTimeout: NodeJS.Timeout | undefined;
    nbHintAsked = 0;

    constructor(gameroomMetadata: IGameroomMetadata) {
        super(gameroomMetadata);
        this.channelName = `${gameroomMetadata.gameroomName}'s private channel`;
        this.gameroomMetadata.users.forEach((username: string) => {
            if (VIRTUAL_PLAYER_NAMES.has(username)) {
                this.virtualPlayer = username;
            } else {
                this.humainPlayers.push(username);
            }
        });
        this.difficulty = this.gameroomMetadata.difficulty;
    }

    // game
    startGame() {
        this.startTime = Date.now();
        this.virtualChatter.gameStart(this.virtualPlayer, this.channelName);
        this.gameroomMetadata.isInGame = true;
        this.gameCommunications.dispatchToAll(SOCKET.GAME_START, { gameroomName: this.gameroomMetadata.gameroomName });
        this.startTurn();
    }
    endGame() {
        this.gameroomMetadata.isInGame = false;
        this.gameCommunications.dispatchToAll(SOCKET.GAME_END, { gameroomName: this.gameroomMetadata.gameroomName });

        if (this.lastPair) {
            this.virtualChatter.turnEnd(this.virtualPlayer, this.channelName, `Last word was : "${this.lastPair.word}".`);
        }

        this.endTime = Date.now();
        const scoresMap = new Map();
        this.humainPlayers.forEach((username) => {
            scoresMap.set(username, this.score);
        });
        scoresMap.set(this.virtualPlayer, 0);
        const gameHistory = {
            gameMode: this.gameroomMetadata.gameMode,
            scores: scoresMap,
            startTime: this.startTime,
            endTime: this.endTime,
        };

        Promise.all(
            this.humainPlayers.map((username) => {
                return this.dbCommunications.getStatsHistory(username);
            }),
        ).then((statsHistories: IStatsHistory[]) => {
            this.humainPlayers.forEach((username, index) => {
                this.dbCommunications.addGameHistory(username, gameHistory);

                const oldStats = _.get(statsHistories[index], 'statistics');

                const totalGamePlayed = (oldStats.totalGamePlayed || 0) + 1;
                const totalFFAPlayed = oldStats.totalFFAPlayed || 0;
                const totalSprintPlayed = (oldStats.totalSprintPlayed || 0) + 1;
                const totalFFAWin = oldStats.totalFFAWin || 0;
                const FFAWinRatio = isNaN(totalFFAWin / totalFFAPlayed) ? 0 : totalFFAWin / totalFFAPlayed;
                const totalGameTime = (oldStats.totalGameTime || 0) + (this.endTime - this.startTime) / 1000;
                const timePerGame = isNaN(totalGameTime / totalGamePlayed) ? 0 : totalGameTime / totalGamePlayed;
                const bestSoloScore =
                    this.humainPlayers.length === 1 ? Math.max(oldStats.bestSoloScore || 0, this.score) : oldStats.bestSoloScore || 0;

                this.dbCommunications.updateStats(username, {
                    totalGamePlayed,
                    totalFFAPlayed,
                    totalSprintPlayed,
                    totalFFAWin,
                    FFAWinRatio,
                    totalGameTime,
                    timePerGame,
                    bestSoloScore,
                });
            });
        });
    }

    // turn
    async dispatchTurnInfo() {
        const pair: IPair | undefined = await this.pairManager.getOneRandomPairByDifficulty(this.difficulty);
        const turnInfoObject = {
            drawer: this.virtualPlayer,
            virtualDrawing: pair,
        } as ITurnInfo;
        this._dispatchToAllPlayers(SOCKET.TURN_INFO, turnInfoObject);
        this.lastPair = pair;
    }

    async startTurn(secondsLeft: number = 0, shouldAddNewTime: boolean = true) {
        this.nbHintAsked = 0;
        this.nAttemptsLeft = GAME_CONSTANTS.N_ATTEMPTS - this.difficulty * GAME_CONSTANTS.N_ATTEMPTS_SUB;

        await this.dispatchTurnInfo();

        const turnDurationSeconds =
            (shouldAddNewTime ? GAME_CONSTANTS.TURN_DURATION_SECONDS - this.difficulty * GAME_CONSTANTS.TURN_DURATION_SECONDS_SUB : 0) +
            secondsLeft;
        const endTime = new Date();
        endTime.setSeconds(endTime.getSeconds() + turnDurationSeconds);
        this.endTimestamp = Math.floor(endTime.getTime() / 1000);

        this._dispatchToAllPlayers(SOCKET.TURN_START, {
            endTimestamp: Math.round(turnDurationSeconds),
            nAttempts: GAME_CONSTANTS.N_ATTEMPTS - this.difficulty * GAME_CONSTANTS.N_ATTEMPTS_SUB,
        });

        this.turnTimeout = setTimeout(() => {
            this.endGame();
        }, turnDurationSeconds * 1000);

        if (turnDurationSeconds >= GAME_CONSTANTS.TURN_MESSAGE_COUNTDOWN_SECONDS) {
            this.messageTimeout = setTimeout(() => {
                this.virtualChatter.duringTurn(this.virtualPlayer, this.channelName);
            }, (turnDurationSeconds - GAME_CONSTANTS.TURN_MESSAGE_COUNTDOWN_SECONDS) * 1000);
        }
    }
    endTurn() {
        clearTimeout(this.turnTimeout as NodeJS.Timeout);
        clearTimeout(this.messageTimeout as NodeJS.Timeout);
        this._dispatchToAllPlayers(SOCKET.TURN_END, {});
        if (this.lastPair) {
            this.virtualChatter.turnEnd(this.virtualPlayer, this.channelName, `Last word was : "${this.lastPair.word}".`);
        }
    }

    wordChoice(word: string) {
        console.error(`wordChoice Function not implemented.`);
    }

    hintAsked(username: string) {
        this.nbHintAsked++;
        this._dispatchToAllPlayers(SOCKET.HINT_ASKED, { gameroomName: this.gameroomMetadata.gameroomName });
    }

    // guess
    goodGuess(goodGuesser: string) {
        this.virtualChatter.goodGuess(this.virtualPlayer, this.channelName, goodGuesser);
        this._dispatchToAllPlayers(SOCKET.GOOD_GUESS, { gameroomName: this.gameroomMetadata.gameroomName, username: goodGuesser });
        this.newScore(goodGuesser);
        this.endTurn();
        const nowTimestamp = Math.floor(Date.now() / 1000);
        const secondsLeft = this.endTimestamp - nowTimestamp;
        this.startTurn(secondsLeft);
    }
    badGuess(badGuesser: string, word: string) {
        this.virtualChatter.badGuess(this.virtualPlayer, this.channelName, badGuesser);
        this._dispatchToAllPlayers(SOCKET.BAD_GUESS, { gameroomName: this.gameroomMetadata.gameroomName, username: badGuesser, word });
        if (this.nAttemptsLeft <= 1) {
            this.endTurn();
            const nowTimestamp = Math.floor(Date.now() / 1000);
            const secondsLeft = this.endTimestamp - nowTimestamp;
            this.startTurn(secondsLeft, false);
        } else {
            this.attemptConsumed();
        }
    }

    newScore(goodGuesser: string) {
        this.score += Math.max(GAME_CONSTANTS.TURN_WINNING_SCORE - this.nbHintAsked * GAME_CONSTANTS.TURN_WINNING_SCORE_SUB, 0);
        this._dispatchToAllPlayers(SOCKET.NEW_SCORE, { username: goodGuesser, score: this.score });
    }
    attemptConsumed() {
        this.nAttemptsLeft--;
        this._dispatchToAllPlayers(SOCKET.ATTEMPT_CONSUMED, {});
    }

    // draw
    dispatchDrawNewElement(drawerUsername: string, dataString: string) {
        console.error(`dispatchDrawNewElement Function not implemented.`);
    }
    dispatchDrawNewCoords(drawerUsername: string, dataString: string) {
        console.error(`dispatchDrawNewCoords Function not implemented.`);
    }
    dispatchDrawDeleteElement(drawerUsername: string, dataString: string) {
        console.error(`dispatchDrawDeleteElement Function not implemented.`);
    }
    dispatchDrawUndeleteCoords(drawerUsername: string, dataString: string) {
        console.error(`dispatchDrawUndeleteCoords Function not implemented.`);
    }
    drawEditBackground(drawerUsername: string, dataString: string) {
        console.error(`drawEditBackground Function not implemented.`);
    }
}
