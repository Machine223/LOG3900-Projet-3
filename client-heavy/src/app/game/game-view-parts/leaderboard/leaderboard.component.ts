import { Component} from '@angular/core';
import { MeleeGame } from '../../game-family/melee/melee';
import { GameManagerService } from '../../game-manager.service';

@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard.component.html',
    styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent {
    game: MeleeGame;

    constructor(private gameManager: GameManagerService) {
        this.game = this.gameManager.currentGame as MeleeGame;
    }
}
