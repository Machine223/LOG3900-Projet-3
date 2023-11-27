import { Component, EventEmitter, Output } from '@angular/core';
import { GameManagerService } from 'src/app/game/game-manager.service';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { GameMode } from 'src/app/profile/user-profile/history/game-information/game-mode';
import { Difficulty } from 'src/app/word-image-pair/enums/difficulty';
import { GameroomManagerService } from '../gameroom-manager.service';

@Component({
    selector: 'app-gameroom-view',
    templateUrl: './gameroom-view.component.html',
    styleUrls: ['./gameroom-view.component.scss'],
})
export class GameroomViewComponent {
    currentView: string;
    currentGameMode: GameMode;
    currentDifficulty: Difficulty;
    @Output() newNavigation: EventEmitter<string>;

    constructor(
        public constants: ConstantsRepositoryService,
        public gameroomManager: GameroomManagerService,
        public gameManager: GameManagerService,
    ) {
        this.newNavigation = new EventEmitter();
        this.currentView = constants.PRE_GAMEROOM_FORM;
    }

    public get gameMode(): typeof GameMode {
        return GameMode;
    }

    backToMenu(): void {
        this.newNavigation.emit(this.constants.MAIN_MENU);
    }
}
