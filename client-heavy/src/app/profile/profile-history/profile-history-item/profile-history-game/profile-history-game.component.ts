import { Component, Input, OnInit } from '@angular/core';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { IGameInformation } from 'src/app/profile/user-profile/history/game-information/game-information';
import { GameMode } from 'src/app/profile/user-profile/history/game-information/game-mode';

@Component({
    selector: 'app-profile-history-game',
    templateUrl: './profile-history-game.component.html',
    styleUrls: ['./profile-history-game.component.scss'],
})
export class ProfileHistoryGameComponent implements OnInit {
    @Input() gameInformation: IGameInformation;
    playerScores: [string, number][];
    virtualPlayers: string[];

    get eventDate(): string {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        const date: Date = new Date(this.gameInformation.startTime);
        return date.toLocaleTimeString('en-US', options);
    }

    get itemGameMode(): string {
        switch (this.gameInformation.gameMode) {
            case GameMode.Melee: {
                return 'Free-for-all';
            }
            case GameMode.Solo: {
                return 'Sprint solo';
            }
            case GameMode.Coop: {
                return 'Sprint coop';
            }
        }
    }

    get isFFAGame(): boolean {
        return this.gameInformation.gameMode === GameMode.Melee;
    }

    constructor(private constants: ConstantsRepositoryService) {
        this.playerScores = [];
        this.virtualPlayers = [];
    }

    ngOnInit(): void {
        this.gameInformation.scores.forEach((score: number, username: string) => {
            if (!this.constants.VIRTUAL_PLAYER_NAMES.has(username)) {
                this.playerScores.push([username, score]);
            } else {
                this.virtualPlayers.push(username);
            }
        });
        this.playerScores.sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
    }

    round(score: number): number {
        return Math.round(score);
    }
}
