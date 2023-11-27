import { Component } from '@angular/core';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { Game } from '../../game-family/game';
import { GameManagerService } from '../../game-manager.service';

@Component({
    selector: 'app-player-answer-counter',
    templateUrl: './player-answer-counter.component.html',
    styleUrls: ['./player-answer-counter.component.scss'],
})
export class PlayerAnswerCounterComponent {
    private game: Game;

    constructor(private gameManager: GameManagerService, private constants: ConstantsRepositoryService) {
        this.game = this.gameManager.currentGame;
    }

    get users(): string[] {
        const users: string[] = [];
        this.game.linkedGameroom.users.forEach((user: string) => {
            if (!this.constants.VIRTUAL_PLAYER_NAMES.has(user)) {
                users.push(user);
            }
        });
        return users;
    }
}
