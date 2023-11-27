import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { GameMode } from 'src/app/profile/user-profile/history/game-information/game-mode';
import { TutorialService } from 'src/app/tutorial/tutorial.service';
import { Difficulty } from 'src/app/word-image-pair/enums/difficulty';

@Component({
    selector: 'app-pre-gameroom-form',
    templateUrl: './pre-gameroom-form.component.html',
    styleUrls: ['./pre-gameroom-form.component.scss'],
})
export class PreGameroomFormComponent implements AfterViewInit {
    @Output() wantsExit: EventEmitter<void>;
    @Output() newNavigation: EventEmitter<string>;
    @Output() gameModeChoice: EventEmitter<GameMode>;
    @Output() difficultyChoice: EventEmitter<Difficulty>;
    currentGameMode: GameMode;
    currentDifficulty: Difficulty;

    constructor(private constants: ConstantsRepositoryService, public tutorial: TutorialService) {
        this.wantsExit = new EventEmitter();
        this.newNavigation = new EventEmitter();
        this.difficultyChoice = new EventEmitter();
        this.gameModeChoice = new EventEmitter();
        this.currentGameMode = GameMode.Melee;
        this.currentDifficulty = Difficulty.Easy;
    }

    ngAfterViewInit(): void {
        if (this.tutorial.isTutorial) {
            this.tutorial.nextStep();
        }
    }

    formCompleted(): void {
        this.gameModeChoice.emit(this.currentGameMode);
        this.difficultyChoice.emit(this.currentDifficulty);
        this.newNavigation.emit(this.constants.GAMEROOM);
    }

    backToMenu(): void {
        if (!this.tutorial.isTutorial) {
            this.wantsExit.emit();
        }
    }
}
