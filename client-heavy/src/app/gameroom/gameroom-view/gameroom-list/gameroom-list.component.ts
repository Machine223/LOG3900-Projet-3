import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';

import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { AlertService } from 'src/app/pop-up/alert/alert.service';
import { GameMode } from 'src/app/profile/user-profile/history/game-information/game-mode';
import { TutorialService } from 'src/app/tutorial/tutorial.service';
import { Difficulty } from 'src/app/word-image-pair/enums/difficulty';
import { Gameroom } from '../../gameroom';
import { GameroomManagerService } from '../../gameroom-manager.service';

@Component({
    selector: 'app-gameroom-list',
    templateUrl: './gameroom-list.component.html',
    styleUrls: ['./gameroom-list.component.scss'],
})
export class GameroomListComponent implements AfterViewInit {
    @Input() difficulty: Difficulty;
    @Input() gameMode: GameMode;
    @Output() newNavigation: EventEmitter<string>;
    newGameroomName: string;
    gameModeStringConverter: Map<GameMode, string> = new Map<GameMode, string>([
        [GameMode.Melee, 'Free-for-all'],
        [GameMode.Solo, 'Sprint solo'],
        [GameMode.Coop, 'Sprint coop'],
    ]);

    difficultyStringConverter: Map<Difficulty, string> = new Map<Difficulty, string>([
        [Difficulty.Easy, 'Easy'],
        [Difficulty.Moderate, 'Moderate'],
        [Difficulty.Hard, 'Hard'],
    ]);

    constructor(
        public gameroomManager: GameroomManagerService,
        private constants: ConstantsRepositoryService,
        private alertService: AlertService,
        private tutorial: TutorialService,
    ) {
        this.newNavigation = new EventEmitter();
        this.newGameroomName = '';
    }

    ngAfterViewInit(): void {
        if (this.tutorial.isTutorial) {
            this.tutorial.nextStep();
        }
    }

    backToForm(): void {
        this.newNavigation.emit(this.constants.PRE_GAMEROOM_FORM);
    }

    createGameroom(): void {
        if (this.newGameroomName.trim().length > 0) {
            if (this.gameroomManager.gamerooms.has(this.newGameroomName)) {
                const title = 'Gameroom already exists';
                const content = 'This gameroom name already exists, please use another one';
                this.alertService.alertError(title, content);
            } else {
                this.gameroomManager.createGameroomEvent(this.newGameroomName, this.gameMode, this.difficulty);
                this.newGameroomName = '';
            }
        } else {
            this.newGameroomName = '';
        }
    }

    getFilteredGameRoom(): Gameroom[] {
        const fileteredGamerooms: Gameroom[] = [];
        this.gameroomManager.gamerooms.forEach((gameRoom: Gameroom, name: string) => {
            if (gameRoom.difficulty === this.difficulty && gameRoom.gameMode === this.gameMode) {
                fileteredGamerooms.push(gameRoom);
            }
        });
        return fileteredGamerooms;
    }
}
