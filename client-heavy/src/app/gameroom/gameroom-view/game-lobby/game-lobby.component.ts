import { AfterViewInit, Component, Input } from '@angular/core';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { GameMode } from 'src/app/profile/user-profile/history/game-information/game-mode';
import { TutorialService } from 'src/app/tutorial/tutorial.service';
import { Difficulty } from 'src/app/word-image-pair/enums/difficulty';
import { Gameroom } from '../../gameroom';

@Component({
    selector: 'app-game-lobby',
    templateUrl: './game-lobby.component.html',
    styleUrls: ['./game-lobby.component.scss'],
})
export class GameLobbyComponent implements AfterViewInit {
    @Input() gameroom: Gameroom;
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
    constructor(public constants: ConstantsRepositoryService, private tutorial: TutorialService) {}

    ngAfterViewInit(): void {
        if (this.tutorial.isTutorial) {
            this.tutorial.nextStep();
        }
    }

    leaveGameroom(): void {
        if (!this.tutorial.isTutorial) {
            this.gameroom.quitGameroomEvent();
        }
    }

    removeVirtualPlayer(virtualPlayerName: string): void {
        this.gameroom.removeVirtualPlayerEvent(virtualPlayerName);
    }

    addVirtualPlayer(virtualPlayerName: string): void {
        this.gameroom.addVirtualPlayerEvent(virtualPlayerName);
        if (this.tutorial) {
            this.tutorial.addUserGameroom();
        }
    }

    getMaximumString(): string {
        switch (this.gameroom.gameMode) {
            case GameMode.Melee: {
                return '4 players';
            }
            case GameMode.Solo: {
                return '1 virtual player + 1 human player';
            }
            case GameMode.Coop: {
                return '1 virtual player + 4 human players';
            }
        }
    }

    getRequiredString(): string {
        switch (this.gameroom.gameMode) {
            case GameMode.Melee: {
                return '3 players, at least 2 humans';
            }
            case GameMode.Solo: {
                return '1 virtual player + 1 human player';
            }
            case GameMode.Coop: {
                return '1 virtual player + 2 human players';
            }
        }
    }

    startGame(): void {
        this.gameroom.startGameEvent();
    }
}
