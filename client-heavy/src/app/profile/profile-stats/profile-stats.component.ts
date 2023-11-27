import { Component } from '@angular/core';
import { ProfileManagerService } from '../profile-manager.service';

@Component({
    selector: 'app-profile-stats',
    templateUrl: './profile-stats.component.html',
    styleUrls: ['./profile-stats.component.scss'],
})
export class ProfileStatsComponent {
    get isUpdating(): boolean {
        return this.profileManager.isUpdatingStatsHistory;
    }

    get nGamePlayed(): number {
        return this.profileManager.userProfile.statistics.totalGamePlayed;
    }

    get timePlayed(): string {
        return this.formatSeconds(this.profileManager.userProfile.statistics.totalGameTime);
    }

    get timePerGame(): string {
        return this.formatSeconds(this.profileManager.userProfile.statistics.timePerGame);
    }

    get winRatio(): string {
        return Math.round(this.profileManager.userProfile.statistics.FFAWinRatio * 100) + '%';
    }

    get soloScore(): number {
        return this.profileManager.userProfile.statistics.bestSoloScore;
    }
    constructor(public profileManager: ProfileManagerService) {}

    private formatSeconds(timeInSeconds: number): string {
        const year: number = Math.floor(timeInSeconds / 31536000);
        const days: number = Math.floor((timeInSeconds % 31536000) / 86400);
        const hours: number = Math.floor((timeInSeconds % 86400) / 3600);
        const minutes: number = Math.floor((timeInSeconds % 3600) / 60);
        const seconds: number = Math.floor(timeInSeconds % 60);
        let formattedTime = '';
        if (year) {
            formattedTime += year + ' years, ';
        }
        if (days) {
            formattedTime += days + ' days, ';
        }
        if (hours) {
            formattedTime += hours + ' hours, ';
        }
        if (minutes) {
            formattedTime += minutes + ' min, ';
        }
        formattedTime += seconds + ' sec';
        return formattedTime;
    }
}
