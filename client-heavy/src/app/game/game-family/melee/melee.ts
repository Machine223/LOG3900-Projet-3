import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ColorManagerService } from 'src/app/drawing/drawers/color/color-manager.service';
import { Rgba } from 'src/app/drawing/drawers/color/rgba';
import { EraserToolService } from 'src/app/drawing/drawers/local-tools/drawing-tools/eraser-tool/eraser-tool.service';
import { GridManagerService } from 'src/app/drawing/drawers/local-tools/grid/grid-manager.service';
import { StrokeContainerService } from 'src/app/drawing/drawers/stroke-container/stroke-container.service';
import { VirtualDrawerService } from 'src/app/drawing/drawers/virtual-drawer/virtual-drawer.service';
import { Gameroom } from 'src/app/gameroom/gameroom';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { ProfileManagerService } from 'src/app/profile/profile-manager.service';
import { TutorialService } from 'src/app/tutorial/tutorial.service';
import { GameCommunicationsService } from '../../communications/game-communications.service';
import { GameLocalStateService } from '../../game-local-state.service';
import { INetworkAttemptConsumed } from '../../game-network-interface/network-game-attempt-consumed';
import { INetworkNewScore } from '../../game-network-interface/network-game-new-score';
import { INetworkTurnEnd } from '../../game-network-interface/network-game-turn-end';
import { INetworkTurnInfo } from '../../game-network-interface/network-game-turn-info';
import { INetworkTurnStart } from '../../game-network-interface/network-game-turn-start';
import { INetworkWordBadGuess } from '../../game-network-interface/network-game-word-bad-guess';
import { INetworkWordChoice } from '../../game-network-interface/network-game-word-choice';
import { INetworkWordGoodGuess } from '../../game-network-interface/network-game-word-good-guess';
import { Sound } from '../../sound';
import { SoundPlayerService } from '../../sound-player.service';
import { Game } from '../game';
import { Role } from './role';

export class MeleeGame extends Game {
    protected _attemptLeft: number;
    private _scoreBoard: Map<string, number>;

    private _isWordChoicesShownSubject: BehaviorSubject<boolean>;
    isWordChoicesShownObservable: Observable<boolean>;

    private _scoreSubject: Subject<INetworkNewScore>;
    scoreObservable: Observable<INetworkNewScore>;

    wordChoices: string[];
    role: Role;
    currentDrawer: string;

    get attemptLeft(): number {
        return this._attemptLeft;
    }

    get scoreBoard(): Map<string, number> {
        return this._scoreBoard;
    }

    constructor(
        protected gameCommunications: GameCommunicationsService,
        private virtualDrawer: VirtualDrawerService,
        private constants: ConstantsRepositoryService,
        private profile: ProfileManagerService,
        private strokeContainer: StrokeContainerService,
        private colorManager: ColorManagerService,
        private gameStateManager: GameLocalStateService,
        private gridManager: GridManagerService,
        private soundPlayer: SoundPlayerService,
        private eraserTool: EraserToolService,
        private tutorial: TutorialService,
        linkedGameroom: Gameroom,
    ) {
        super(gameCommunications, linkedGameroom);
        this.role = null;
        this._hasFoundAnswer = false;
        this.wordChoices = [];
        this._isWordChoicesShownSubject = this.tutorial.isTutorial
            ? new BehaviorSubject<boolean>(false)
            : new BehaviorSubject<boolean>(true);
        this.isWordChoicesShownObservable = this._isWordChoicesShownSubject.asObservable();
        this._scoreSubject = new Subject<INetworkNewScore>();
        this.scoreObservable = this._scoreSubject.asObservable();
        this._scoreBoard = new Map<string, number>();
        this.linkedGameroom.users.forEach((user: string) => this._scoreBoard.set(user, 0));
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
            this.previousTries.push(guess);
            return false;
        }
    }

    newTurnInfo(turnInfo: INetworkTurnInfo): void {
        this.currentDrawer = turnInfo.drawer;
        this.setRole(turnInfo.drawer);
        this._hasFoundAnswer = false;

        if (this.role === Role.GuesserWithVirtualDrawer) {
            this.virtualDrawer.setDrawing(turnInfo.virtualDrawing);
            this._wordToGuess = turnInfo.virtualDrawing.word;
            this._hints = turnInfo.virtualDrawing.hints;
            this._nHints = 0;
        } else if (this.role === Role.GuesserWithoutVirtualDrawer) {
            this._wordToGuess = turnInfo.virtualDrawing.word;
            this._hints = turnInfo.virtualDrawing.hints;
            this._nHints = 0;
        } else if (this.role === Role.Drawer && this.tutorial.isTutorial) {
            this._wordToGuess = turnInfo.virtualDrawing.word;
            this._turnEndTimeStamp = 3600;
        }
    }

    turnStart(turnStart: INetworkTurnStart): void {
        this.soundPlayer.playNotification(Sound.TurnStart);
        this._turnEndTimeStamp = Date.now() / 1000 + turnStart.endTimestamp;
        this._previousTries = [];
        this.isTurnActiveSource.next(true);
        this._isWordChoicesShownSubject.next(false);

        if (this.role === Role.Drawer && !this.tutorial.isTutorial) {
            this.gameStateManager.setAsEmitter();
        } else if (this.role === Role.GuesserWithVirtualDrawer) {
            this.virtualDrawer.startDrawing();
        } else if (this.role === Role.GuesserWithoutVirtualDrawer) {
            this.gameStateManager.setAsListener();
        }
    }

    turnEnd(turnEnd: INetworkTurnEnd): void {
        this._hasFoundAnswer = false;
        this.isTurnActiveSource.next(false);
        if (this.role === Role.GuesserWithVirtualDrawer) {
            this.virtualDrawer.stopDrawing();
        }

        if (!this.tutorial.isTutorial) {
            this._isWordChoicesShownSubject.next(true);
            this.gameStateManager.muteAndDeafen();
        }
        this.resetDrawingView();
    }

    endGame(): void {
        this.virtualDrawer.stopDrawing();
        this._isWordChoicesShownSubject.next(false);
        this.gameStateManager.muteAndDeafen();
    }

    goodGuess(goodGuess: INetworkWordGoodGuess): void {
        this.goodGuessEventSource.next(goodGuess.username);
    }

    badGuess(badGuess: INetworkWordBadGuess): void {
        this.badGuessEventSource.next(badGuess.username);
    }

    attemptConsumed(attemptConsumed: INetworkAttemptConsumed): void {
        this._attemptLeft -= 1;
    }

    newScore(newScore: INetworkNewScore): void {
        this._scoreBoard.set(newScore.username, newScore.score);
        this._scoreSubject.next(newScore);
    }

    newWordChoice(wordChoice: INetworkWordChoice): void {
        this.role = Role.Drawer;
        this.wordChoices = wordChoice.words;
    }

    chooseWord(word: string): void {
        this._wordToGuess = word;
        this.gameCommunications.emitWordChoice([word], this._linkedGameroom.name);
    }

    getNewHint(): void {
        this.newHintAskedSource.next(this._hints[this._nHints++]);
    }

    private setRole(drawerName: string): void {
        if (this.profile.userProfile.username === drawerName) {
            this.role = Role.Drawer;
        } else if (this.constants.VIRTUAL_PLAYER_NAMES.has(drawerName) || this.tutorial.isTutorial) {
            this.role = Role.GuesserWithVirtualDrawer;
        } else {
            this.role = Role.GuesserWithoutVirtualDrawer;
        }
    }

    private resetDrawingView(): void {
        this.strokeContainer.resetContainer();
        const backGroundColor: Rgba = new Rgba();
        backGroundColor.setFromHex(this.constants.WHITE_COLOR);
        this.colorManager.changeDrawingSurfaceColorValue(backGroundColor);
        this.gridManager.setVisibility(false);
        this.eraserTool.resetEraser();
        this._turnEndTimeStamp = undefined;
        this.role = null;
    }
}
