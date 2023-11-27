import { VirtualDrawerService } from 'src/app/drawing/drawers/virtual-drawer/virtual-drawer.service';
import { Gameroom } from 'src/app/gameroom/gameroom';
import { GameCommunicationsService } from '../communications/game-communications.service';
import { INetworkAttemptConsumed } from '../game-network-interface/network-game-attempt-consumed';
import { INetworkHintAsked } from '../game-network-interface/network-game-hint-asked';
import { INetworkNewScore } from '../game-network-interface/network-game-new-score';
import { INetworkTurnEnd } from '../game-network-interface/network-game-turn-end';
import { INetworkTurnInfo } from '../game-network-interface/network-game-turn-info';
import { INetworkTurnStart } from '../game-network-interface/network-game-turn-start';
import { INetworkWordBadGuess } from '../game-network-interface/network-game-word-bad-guess';
import { INetworkWordGoodGuess } from '../game-network-interface/network-game-word-good-guess';
import { Sound } from '../sound';
import { SoundPlayerService } from '../sound-player.service';
import { Game } from './game';

export class SprintGame extends Game {
    private _guessCounter: Map<string, [number, number]>;

    get guessCounter(): Map<string, [number, number]> {
        return this._guessCounter;
    }

    constructor(
        protected gameCommunications: GameCommunicationsService,
        private virtualDrawer: VirtualDrawerService,
        private soundPlayer: SoundPlayerService,
        linkedGameroom: Gameroom,
    ) {
        super(gameCommunications, linkedGameroom);
        this._guessCounter = new Map<string, [number, number]>();
        linkedGameroom.users.forEach((user: string) => this._guessCounter.set(user, [0, 0]));
    }

    guessTryEvent(guess: string): boolean {
        if (guess.toLocaleLowerCase() === this._wordToGuess.toLocaleLowerCase()) {
            this.soundPlayer.playNotification(Sound.GoodGuess);
            this.gameCommunications.emitGoodGuess(this._linkedGameroom.name, this._nHints);
            this._hasFoundAnswer = true;
            return true;
        } else {
            this.soundPlayer.playNotification(Sound.BadGuess);
            this.gameCommunications.emitBadGuess(this._linkedGameroom.name, guess);
            return false;
        }
    }

    newTurnInfo(turnInfo: INetworkTurnInfo): void {
        this.virtualDrawer.setDrawing(turnInfo.virtualDrawing);
        this._hasFoundAnswer = false;
        this._wordToGuess = turnInfo.virtualDrawing.word;
        this._hints = turnInfo.virtualDrawing.hints;
        this._nHints = 0;
    }

    turnStart(turnStart: INetworkTurnStart): void {
        this.soundPlayer.playNotification(Sound.TurnStart);
        this._attemptLeft = turnStart.nAttempts;
        this._turnEndTimeStamp = Date.now() / 1000 + turnStart.endTimestamp;
        this._previousTries = [];
        this.isTurnActiveSource.next(true);
        this.virtualDrawer.startDrawing();
    }

    turnEnd(turnEnd: INetworkTurnEnd): void {
        this.isTurnActiveSource.next(false);
        this.virtualDrawer.stopDrawing();
        this._turnEndTimeStamp = undefined;
    }

    attemptConsumed(attemptConsumed: INetworkAttemptConsumed): void {
        this._attemptLeft -= 1;
    }

    newScore(newScore: INetworkNewScore): void {
        this._score = newScore.score;
    }

    goodGuess(goodGuess: INetworkWordGoodGuess): void {
        const username: string = goodGuess.username;

        const guessCount: [number, number] = this._guessCounter.get(goodGuess.username);
        guessCount[0]++;
        this._guessCounter.set(username, guessCount);

        this.goodGuessEventSource.next(username);
    }

    badGuess(badGuess: INetworkWordBadGuess): void {
        const username: string = badGuess.username;

        const guessCount: [number, number] = this._guessCounter.get(badGuess.username);
        guessCount[1]++;
        this._guessCounter.set(username, guessCount);

        this._previousTries.push(badGuess.word);
        this.badGuessEventSource.next(badGuess.username);
    }

    getNewHint(): void {
        this.gameCommunications.emitHintAsked(this._linkedGameroom.name);
    }

    hintAsked(hintAsked: INetworkHintAsked): void {
        this.newHintAskedSource.next(this._hints[this._nHints++]);
    }

    endGame(): void {
        this.isTurnActiveSource.next(false);
        this.virtualDrawer.stopDrawing();
        this._turnEndTimeStamp = undefined;
    }
}
