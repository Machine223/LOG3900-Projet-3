import _ from 'lodash';
import { GAME_CONSTANTS, SOCKET, VIRTUAL_PLAYER_NAMES } from '../../constants';
import { IGameroomMetadata } from '../../interfaces/IGameroomMetadata';
import { IPair } from '../../interfaces/IPair';
import { IStatsHistory } from '../../interfaces/IStatsHistory';
import { ITurnInfo } from '../../interfaces/ITurnInfo';
import { Game } from './Game';

export class GameFFA extends Game {
    scores: Map<string, number> = new Map();
    nbHintAskedMap: Map<string, number> = new Map();
    players: string[] = [];
    humainPlayers: string[] = [];
    virtualPlayers: string[] = [];
    turnIndex = 0;
    channelName: string;
    endTimestamp = 0;
    nGoodGuess = 0;
    nGoodGuessTarget = 0;
    currentDrawer = '';
    threePairs: Map<string, IPair> = new Map();
    shouldWaitForWordChoice = false;
    turnTimeout: NodeJS.Timeout | undefined;
    messageTimeout: NodeJS.Timeout | undefined;
    startTime = 0;
    endTime = 0;
    difficulty = 0;
    lastPair: IPair | undefined;

    constructor(gameroomMetadata: IGameroomMetadata) {
        super(gameroomMetadata);
        this.players = gameroomMetadata.users;
        this.channelName = `${gameroomMetadata.gameroomName}'s private channel`;
        this.players.forEach((username: string) => {
            if (VIRTUAL_PLAYER_NAMES.has(username)) {
                this.virtualPlayers.push(username);
            } else {
                this.humainPlayers.push(username);
            }
            this.scores.set(username, 0);
            this.nbHintAskedMap.set(username, 0);
        });
        this.difficulty = this.gameroomMetadata.difficulty;
    }

    // game
    startGame() {
        this.startTime = Date.now();
        this.virtualPlayers.forEach((username: string) => {
            this.virtualChatter.gameStart(username, this.channelName);
        });
        this.gameroomMetadata.isInGame = true;
        this.currentDrawer = this.players[this.turnIndex];
        this.gameCommunications.dispatchToAll(SOCKET.GAME_START, { gameroomName: this.gameroomMetadata.gameroomName });
        this.dispatchTurnInfo();
    }
    endGame() {
        this.gameroomMetadata.isInGame = false;
        this.gameCommunications.dispatchToAll(SOCKET.GAME_END, { gameroomName: this.gameroomMetadata.gameroomName });

        this.endTime = Date.now();
        const gameHistory = {
            gameMode: this.gameroomMetadata.gameMode,
            scores: this.scores,
            startTime: this.startTime,
            endTime: this.endTime,
        };

        const winners = new Set();
        let winningScore = -1;
        this.scores.forEach((score, username) => {
            if (score === winningScore) {
                winners.add(username);
            } else if (score > winningScore) {
                winners.clear();
                winners.add(username);
                winningScore = score;
            }
        });

        Promise.all(
            this.humainPlayers.map((username) => {
                return this.dbCommunications.getStatsHistory(username);
            }),
        ).then((statsHistories: IStatsHistory[]) => {
            this.humainPlayers.forEach((username, index) => {
                this.dbCommunications.addGameHistory(username, gameHistory);
                const isWinner = winners.has(username);
                const oldStats = _.get(statsHistories[index], 'statistics');

                const totalGamePlayed = (oldStats.totalGamePlayed || 0) + 1;
                const totalFFAPlayed = (oldStats.totalFFAPlayed || 0) + 1;
                const totalSprintPlayed = oldStats.totalSprintPlayed || 0;
                const totalFFAWin = isWinner ? (oldStats.totalFFAWin || 0) + 1 : oldStats.totalFFAWin || 0;
                const FFAWinRatio = isNaN(totalFFAWin / totalFFAPlayed) ? 0 : totalFFAWin / totalFFAPlayed;
                const totalGameTime = (oldStats.totalGameTime || 0) + (this.endTime - this.startTime) / 1000;
                const timePerGame = isNaN(totalGameTime / totalGamePlayed) ? 0 : totalGameTime / totalGamePlayed;
                const bestSoloScore = oldStats.bestSoloScore || 0;

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
        // TODO handles duplicated pairs
        if (VIRTUAL_PLAYER_NAMES.has(this.currentDrawer)) {
            const pair: IPair | undefined = await this.pairManager.getOneRandomPairByDifficulty(this.difficulty);
            const turnInfoObject = {
                drawer: this.currentDrawer,
                virtualDrawing: pair,
            } as ITurnInfo;
            this._dispatchToAllPlayers(SOCKET.TURN_INFO, turnInfoObject);
            this.startTurn();
            this.lastPair = pair;
        } else {
            const threePairs: Map<string, IPair> = await this.pairManager.getThreePairs();
            this.threePairs = threePairs;
            this.gameCommunications.dispatchToOne(SOCKET.WORD_CHOICE, this.currentDrawer, {
                gameroomName: this.gameroomMetadata.gameroomName,
                words: Array.from(threePairs.keys()),
            });
        }
    }

    async startTurn() {
        this.players.forEach((username: string) => {
            this.nbHintAskedMap.set(username, 0);
        });

        const turnDurationSeconds = GAME_CONSTANTS.TURN_DURATION_SECONDS - GAME_CONSTANTS.TURN_DURATION_SECONDS_SUB * this.difficulty;
        const endTime = new Date();
        endTime.setSeconds(endTime.getSeconds() + turnDurationSeconds);
        this.endTimestamp = Math.floor(endTime.getTime() / 1000);

        this._dispatchToAllPlayers(SOCKET.TURN_START, { endTimestamp: Math.round(turnDurationSeconds) });

        this.turnTimeout = setTimeout(() => {
            this.endTurn();
            if (this.gameroomMetadata.isInGame) {
                this.dispatchTurnInfo();
            }
        }, turnDurationSeconds * 1000);

        this.nGoodGuess = 0;
        this.nGoodGuessTarget =
            this.players.length - this.virtualPlayers.length - (this.virtualPlayers.includes(this.currentDrawer) ? 0 : 1);

        if (turnDurationSeconds >= GAME_CONSTANTS.TURN_MESSAGE_COUNTDOWN_SECONDS) {
            this.messageTimeout = setTimeout(() => {
                this.virtualChatter.duringTurn(_.sample(this.virtualPlayers), this.channelName);
            }, (turnDurationSeconds - GAME_CONSTANTS.TURN_MESSAGE_COUNTDOWN_SECONDS) * 1000);
        }
    }
    endTurn() {
        clearTimeout(this.turnTimeout as NodeJS.Timeout);
        clearTimeout(this.messageTimeout as NodeJS.Timeout);
        this._dispatchToAllPlayers(SOCKET.TURN_END, {});
        this.newScore(this.currentDrawer);

        if (this.lastPair) {
            this.virtualChatter.turnEnd(
                _.sample(this.virtualPlayers) || 'Virtual Xi Chen',
                this.channelName,
                `Last word was : "${this.lastPair.word}".`,
            );
        }

        this.turnIndex++;
        if (this.turnIndex < this.players.length) {
            this.currentDrawer = this.players[this.turnIndex];
        } else {
            this.endGame();
        }
    }

    wordChoice(word: string) {
        const turnInfoObject = {
            drawer: this.currentDrawer,
            virtualDrawing: this.threePairs.get(word),
        } as ITurnInfo;
        this._dispatchToAllPlayers(SOCKET.TURN_INFO, turnInfoObject);
        this.startTurn();
        this.lastPair = this.threePairs.get(word);
    }

    hintAsked(username: string) {
        const oldNbHintAsked = this.nbHintAskedMap.get(username) || 0;
        this.nbHintAskedMap.set(username, oldNbHintAsked + 1);
        this._dispatchToAllPlayers(SOCKET.HINT_ASKED, { gameroomName: this.gameroomMetadata.gameroomName });
    }

    // guess
    goodGuess(goodGuesser: string) {
        this.virtualChatter.goodGuess(_.sample(this.virtualPlayers), this.channelName, goodGuesser);
        this._dispatchToAllPlayers(SOCKET.GOOD_GUESS, { gameroomName: this.gameroomMetadata.gameroomName, username: goodGuesser });
        this.newScore(goodGuesser);
        this.nGoodGuess++;
        if (this.nGoodGuess === this.nGoodGuessTarget) {
            this.endTurn();
            if (this.gameroomMetadata.isInGame) {
                this.dispatchTurnInfo();
            }
        }
    }
    badGuess(badGuesser: string, word: string) {
        this.virtualChatter.badGuess(_.sample(this.virtualPlayers), this.channelName, badGuesser);
        this._dispatchToAllPlayers(SOCKET.BAD_GUESS, { gameroomName: this.gameroomMetadata.gameroomName, username: badGuesser, word });
    }

    newScore(player: string) {
        if (VIRTUAL_PLAYER_NAMES.has(player)) return;
        if (this.currentDrawer === player) {
            const oldScore = this.scores.get(player) || 0;
            const newScore = oldScore + this.nGoodGuess * GAME_CONSTANTS.TURN_WINNING_SCORE;
            this.scores.set(player, Math.max(newScore, 0));
        } else {
            const nowTimestamp = Math.floor(Date.now() / 1000);
            const secondsLeft = this.endTimestamp - nowTimestamp;
            const fraction =
                secondsLeft / (GAME_CONSTANTS.TURN_DURATION_SECONDS - GAME_CONSTANTS.TURN_DURATION_SECONDS_SUB * this.difficulty);
            const oldScore = this.scores.get(player) || 0;
            const newScore =
                oldScore +
                Math.max(
                    fraction * GAME_CONSTANTS.TURN_WINNING_SCORE -
                        this.nGoodGuess * GAME_CONSTANTS.TURN_WINNING_SCORE_SUB -
                        (this.nbHintAskedMap.get(player) || 0) * GAME_CONSTANTS.TURN_WINNING_SCORE_SUB,
                    0,
                );
            this.scores.set(player, Math.max(newScore, 0));
        }
        this._dispatchToAllPlayers(SOCKET.NEW_SCORE, { username: player, score: this.scores.get(player) });
    }
    attemptConsumed() {
        console.error(`attemptConsumed Function not implemented.`);
    }

    // draw
    dispatchDrawNewElement(drawerUsername: string, dataString: string) {
        this._dispatchStringToAllGuessers(drawerUsername, SOCKET.DRAW_NEW_ELEMENT, dataString);
    }
    dispatchDrawNewCoords(drawerUsername: string, dataString: string) {
        this._dispatchStringToAllGuessers(drawerUsername, SOCKET.DRAW_NEW_COORDS, dataString);
    }
    dispatchDrawDeleteElement(drawerUsername: string, dataString: string) {
        this._dispatchStringToAllGuessers(drawerUsername, SOCKET.DRAW_DELETE_ELEMENT, dataString);
    }
    dispatchDrawUndeleteCoords(drawerUsername: string, dataString: string) {
        this._dispatchStringToAllGuessers(drawerUsername, SOCKET.DRAW_UNDELETE_ELEMENT, dataString);
    }
    drawEditBackground(drawerUsername: string, dataString: string) {
        this._dispatchStringToAllGuessers(drawerUsername, SOCKET.DRAW_EDIT_BACKGROUND, dataString);
    }
}
