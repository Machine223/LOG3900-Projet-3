import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { Subscriber } from 'src/app/helpers/subscriber';
import { ProfileManagerService } from 'src/app/profile/profile-manager.service';
import { GameMode } from 'src/app/profile/user-profile/history/game-information/game-mode';
import { MeleeGame } from '../../game-family/melee/melee';
import { SprintGame } from '../../game-family/sprint-game';
import { GameManagerService } from '../../game-manager.service';

@Component({
    selector: 'app-end-game-view',
    templateUrl: './end-game-view.component.html',
    styleUrls: ['./end-game-view.component.scss'],
})
export class EndGameViewComponent extends Subscriber {
    isFFAGame: boolean;
    winner: string;
    sortedScoreBoard: [string, number][];
    guessCounters: [string, [number, number]][];

    get score(): number {
        return Math.round(this.gameManager.previousGame.score);
    }

    constructor(
        private gameManager: GameManagerService,
        private constants: ConstantsRepositoryService,
        private profileManager: ProfileManagerService,
        private dialogRef: MatDialogRef<EndGameViewComponent>,
    ) {
        super();
        this.subscriptions.push(this.gameManager.startingNewGame.subscribe(() => this.dialogRef.close()));

        this.isFFAGame = this.gameManager.previousGame.linkedGameroom.gameMode === GameMode.Melee;
        if (this.isFFAGame) {
            const scoreboard: Map<string, number> = (this.gameManager.previousGame as MeleeGame).scoreBoard;
            this.sortedScoreBoard = [];
            scoreboard.forEach((score: number, username: string) => {
                if (!this.constants.VIRTUAL_PLAYER_NAMES.has(username)) {
                    this.sortedScoreBoard.push([username, Math.round(score)]);
                }
            });
            this.sortedScoreBoard.sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
        } else {
            this.guessCounters = [];
            const guessCounter: Map<string, [number, number]> = (this.gameManager.previousGame as SprintGame).guessCounter;
            guessCounter.forEach((score: [number, number], username: string) => {
                if (!this.constants.VIRTUAL_PLAYER_NAMES.has(username)) {
                    this.guessCounters.push([username, score]);
                }
            });
        }
    }

    isSelf(username: string): boolean {
        return username === this.profileManager.userProfile.username;
    }
}
