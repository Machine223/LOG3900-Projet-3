import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ColorManagerService } from '../drawing/drawers/color/color-manager.service';
import { EraserToolService } from '../drawing/drawers/local-tools/drawing-tools/eraser-tool/eraser-tool.service';
import { GridManagerService } from '../drawing/drawers/local-tools/grid/grid-manager.service';
import { StrokeContainerService } from '../drawing/drawers/stroke-container/stroke-container.service';
import { VirtualDrawerService } from '../drawing/drawers/virtual-drawer/virtual-drawer.service';
import { Gameroom } from '../gameroom/gameroom';
import { ConstantsRepositoryService } from '../helpers/constants-repository.service';
import { ProfileManagerService } from '../profile/profile-manager.service';
import { GameMode } from '../profile/user-profile/history/game-information/game-mode';
import { TutorialService } from '../tutorial/tutorial.service';
import { GameCommunicationsService } from './communications/game-communications.service';
import { Game } from './game-family/game';
import { MeleeGame } from './game-family/melee/melee';
import { SprintGame } from './game-family/sprint-game';
import { GameLocalStateService } from './game-local-state.service';
import { INetworkAttemptConsumed } from './game-network-interface/network-game-attempt-consumed';
import { INetworkHintAsked } from './game-network-interface/network-game-hint-asked';
import { INetworkNewScore } from './game-network-interface/network-game-new-score';
import { INetworkTurnEnd } from './game-network-interface/network-game-turn-end';
import { INetworkTurnInfo } from './game-network-interface/network-game-turn-info';
import { INetworkTurnStart } from './game-network-interface/network-game-turn-start';
import { INetworkWordBadGuess } from './game-network-interface/network-game-word-bad-guess';
import { INetworkWordChoice } from './game-network-interface/network-game-word-choice';
import { INetworkWordGoodGuess } from './game-network-interface/network-game-word-good-guess';
import { Sound } from './sound';
import { SoundPlayerService } from './sound-player.service';

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    private _currentGame: Game;
    private _previousGame: Game;

    private startingNewGameSource: Subject<void>;
    startingNewGame: Observable<void>;

    get currentGame(): Game {
        return this._currentGame;
    }

    get previousGame(): Game {
        return this._previousGame;
    }

    constructor(
        private gameCommunications: GameCommunicationsService,
        private virtualDrawer: VirtualDrawerService,
        private constants: ConstantsRepositoryService,
        private profile: ProfileManagerService,
        private strokeContainer: StrokeContainerService,
        public colorManager: ColorManagerService,
        private gameStateManager: GameLocalStateService,
        private gridManager: GridManagerService,
        private soundPlayer: SoundPlayerService,
        private eraserTool: EraserToolService,
        private tutorial: TutorialService,
    ) {
        this.startingNewGameSource = new Subject();
        this.startingNewGame = this.startingNewGameSource.asObservable();
    }

    startNewGame(linkedGameroom: Gameroom): void {
        this.startingNewGameSource.next();
        this.soundPlayer.playMusic();
        this.resetDrawingView();
        if (linkedGameroom.gameMode === GameMode.Melee) {
            this._currentGame = new MeleeGame(
                this.gameCommunications,
                this.virtualDrawer,
                this.constants,
                this.profile,
                this.strokeContainer,
                this.colorManager,
                this.gameStateManager,
                this.gridManager,
                this.soundPlayer,
                this.eraserTool,
                this.tutorial,
                linkedGameroom,
            );
        } else {
            this._currentGame = new SprintGame(this.gameCommunications, this.virtualDrawer, this.soundPlayer, linkedGameroom);
        }
    }

    endGame(): void {
        this.soundPlayer.playNotification(Sound.GameEnd);
        this.soundPlayer.stopMusic();
        this._currentGame.endGame();
        this._previousGame = this._currentGame;
        this._currentGame = undefined;
    }

    newTurnInfo(turnInfo: INetworkTurnInfo): void {
        if (this._currentGame) {
            this._currentGame.newTurnInfo(turnInfo);
        }
    }

    newWordChoice(wordChoice: INetworkWordChoice): void {
        if (this._currentGame) {
            this._currentGame.newWordChoice(wordChoice);
        }
    }

    turnStart(turnStart: INetworkTurnStart): void {
        if (this._currentGame) {
            this._currentGame.turnStart(turnStart);
        }
    }

    turnEnd(turnEnd: INetworkTurnEnd): void {
        if (this._currentGame) {
            this._currentGame.turnEnd(turnEnd);
        }
    }

    goodGuess(goodGuess: INetworkWordGoodGuess): void {
        if (this._currentGame) {
            this._currentGame.goodGuess(goodGuess);
        }
    }

    badGuess(badGuess: INetworkWordBadGuess): void {
        if (this._currentGame) {
            this._currentGame.badGuess(badGuess);
        }
    }

    newScore(newScore: INetworkNewScore): void {
        if (this._currentGame) {
            this._currentGame.newScore(newScore);
        }
    }

    attemptConsumed(attemptConsumed: INetworkAttemptConsumed): void {
        if (this._currentGame) {
            this._currentGame.attemptConsumed(attemptConsumed);
        }
    }

    hintAsked(hintAsked: INetworkHintAsked): void {
        if (this._currentGame) {
            this.currentGame.hintAsked(hintAsked);
        }
    }

    reset(): void {
        this._currentGame = null;
    }

    private resetDrawingView(): void {
        this.strokeContainer.resetContainer();
        this.colorManager.resetAll();
        this.gridManager.setVisibility(false);
        this.eraserTool.resetEraser();
    }
}
