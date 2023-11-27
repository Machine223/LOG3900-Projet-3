import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Gameroom } from 'src/app/gameroom/gameroom';
import { GameCommunicationsService } from '../communications/game-communications.service';
import { INetworkAttemptConsumed } from '../game-network-interface/network-game-attempt-consumed';
import { INetworkHintAsked } from '../game-network-interface/network-game-hint-asked';
import { INetworkNewScore } from '../game-network-interface/network-game-new-score';
import { INetworkTurnEnd } from '../game-network-interface/network-game-turn-end';
import { INetworkTurnInfo } from '../game-network-interface/network-game-turn-info';
import { INetworkTurnStart } from '../game-network-interface/network-game-turn-start';
import { INetworkWordBadGuess } from '../game-network-interface/network-game-word-bad-guess';
import { INetworkWordChoice } from '../game-network-interface/network-game-word-choice';
import { INetworkWordGoodGuess } from '../game-network-interface/network-game-word-good-guess';

export abstract class Game {
    protected _turnEndTimeStamp: number;
    protected _nHints: number;
    protected _hints: string[];
    protected _wordToGuess: string;
    protected _hasFoundAnswer: boolean;
    protected _attemptLeft: number;
    protected _score: number;
    protected _previousTries: string[];

    protected _linkedGameroom: Gameroom;

    protected isTurnActiveSource: BehaviorSubject<boolean>;
    isTurnActive: Observable<boolean>;

    protected newHintAskedSource: Subject<string>;
    newHintAsked: Observable<string>;

    protected badGuessEventSource: Subject<string>;
    badGuessEvent: Observable<string>;

    protected goodGuessEventSource: Subject<string>;
    goodGuessEvent: Observable<string>;

    get users(): Set<string> {
        return this.linkedGameroom.users;
    }

    get attemptLeft(): number {
        return this._attemptLeft;
    }

    get linkedGameroom(): Gameroom {
        return this._linkedGameroom;
    }

    get score(): number {
        return this._score;
    }

    get hasHintLeft(): boolean {
        return this._hints.length !== this._nHints;
    }

    get previousTries(): string[] {
        return this._previousTries;
    }

    get timeLeft(): number {
        return Math.round(this._turnEndTimeStamp - Date.now() / 1000);
    }

    get wordToGuess(): string {
        return this._wordToGuess;
    }

    get hasFoundAnswer(): boolean {
        return this._hasFoundAnswer;
    }

    constructor(protected gameCommunications: GameCommunicationsService, linkedGameroom: Gameroom) {
        this._linkedGameroom = linkedGameroom;
        this.isTurnActiveSource = new BehaviorSubject(false);
        this.isTurnActive = this.isTurnActiveSource.asObservable();

        this.newHintAskedSource = new Subject();
        this.newHintAsked = this.newHintAskedSource.asObservable();

        this.badGuessEventSource = new Subject();
        this.badGuessEvent = this.badGuessEventSource.asObservable();

        this.goodGuessEventSource = new Subject();
        this.goodGuessEvent = this.goodGuessEventSource.asObservable();

        this._score = 0;
        this._nHints = 0;
        this._hints = [];
        this._previousTries = [];
        this._hasFoundAnswer = false;
        this._wordToGuess = '';
    }

    abstract guessTryEvent(guess: string): boolean;

    abstract getNewHint(): void;

    abstract endGame(): void;

    hintAsked(hintAsked: INetworkHintAsked): void {}

    newScore(newScore: INetworkNewScore): void {}

    attemptConsumed(attemptConsumed: INetworkAttemptConsumed): void {}

    newTurnInfo(turnInfo: INetworkTurnInfo): void {}

    newWordChoice(wordChoice: INetworkWordChoice): void {}

    turnStart(turnStart: INetworkTurnStart): void {}

    turnEnd(turnEnd: INetworkTurnEnd): void {}

    goodGuess(goodGuess: INetworkWordGoodGuess): void {}

    badGuess(badGuess: INetworkWordBadGuess): void {}
}
