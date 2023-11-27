import { Theme } from '../profile-account/theme';
import { IHistory } from './history/history';
import { INetworkUserProfile } from './network-user-profile';
import { IStatistic } from './statistic/statistic';

export class UserProfile {
    username: string;
    firstName: string;
    lastName: string;
    avatarName: string;
    theme: Theme;
    history: IHistory;
    statistics: IStatistic;

    constructor() {
        this.clear();
    }

    copyProfile(profile: INetworkUserProfile): void {
        this.username = profile.username;
        this.firstName = profile.firstName;
        this.lastName = profile.lastName;
        this.avatarName = profile.avatarName;
        this.theme = profile.theme;
    }

    clear(): void {
        this.username = '';
        this.firstName = '';
        this.lastName = '';
        this.avatarName = '';
        this.theme = Theme.Light;
        this.history = {
            sessions: [],
            games: [],
        };
        this.statistics = {
            totalGamePlayed: 0,
            FFAWinRatio: 0,
            timePerGame: 0,
            totalGameTime: 0,
            bestSoloScore: 0,
        };
    }
}
