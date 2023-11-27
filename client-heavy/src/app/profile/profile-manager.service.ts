import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketService } from '../chat/socket.service';
import { ConstantsRepositoryService } from '../helpers/constants-repository.service';
import { AlertService } from '../pop-up/alert/alert.service';
import { DialogService } from '../pop-up/dialog/dialog.service';
import { PromptTutorialComponent } from '../tutorial/prompt-tutorial/prompt-tutorial.component';
import { ThemeService } from './theme.service';
import { IGameInformation } from './user-profile/history/game-information/game-information';
import { INetworkStatsHistory } from './user-profile/network-stats-history';
import { INetworkUserProfile } from './user-profile/network-user-profile';
import { UserProfile } from './user-profile/user-profile';

@Injectable({
    providedIn: 'root',
})
export class ProfileManagerService {
    userProfile: UserProfile;
    private updatingStatHistorySource: BehaviorSubject<boolean>;
    updatingStatHistory: Observable<boolean>;

    get isUpdatingStatsHistory(): boolean {
        return this.updatingStatHistorySource.value;
    }

    constructor(
        private http: HttpClient,
        private constants: ConstantsRepositoryService,
        private alertService: AlertService,
        private socketService: SocketService,
        private router: Router,
        private themeService: ThemeService,
        private dialogService: DialogService,
    ) {
        this.userProfile = new UserProfile();
        this.updatingStatHistorySource = new BehaviorSubject<boolean>(false);
        this.updatingStatHistory = this.updatingStatHistorySource.asObservable();
    }

    updateStatsAndHistory(): void {
        this.updatingStatHistorySource.next(true);
        this.http.get(`${this.constants.URI}/profile/${this.userProfile.username}/stats-history`).subscribe(
            (statsHistory: INetworkStatsHistory) => {
                statsHistory.history.games.forEach((game: IGameInformation) => {
                    game.scores = new Map(Object.entries(game.scores));
                });
                this.userProfile.history = statsHistory.history;
                this.userProfile.statistics = statsHistory.statistics;
                this.updatingStatHistorySource.next(false);
            },
            (error) => {
                if (error.status === 400) {
                    const TITLE = `Error ${error.status}`;
                    const CONTENT = `User "${this.userProfile.username}" doesn't exist!`;
                    this.alertService.alertError(TITLE, CONTENT);
                }
            },
        );
    }

    signIn(username: string, password: string): void {
        const options = { headers: { username, password } };
        this.http.get(`${this.constants.URI}/session`, options).subscribe(
            (response: Response) => {
                this.getUserProfileAndConnect(username);
            },
            (error) => {
                if (error.status === 400) {
                    const TITLE = `Error ${error.status}`;
                    const CONTENT = `User "${username}" is connected!`;
                    this.alertService.alertError(TITLE, CONTENT);
                }
                if (error.status === 401) {
                    const TITLE = `Error ${error.status}`;
                    const CONTENT = 'Invalid username or password!';
                    this.alertService.alertError(TITLE, CONTENT);
                }
            },
        );
    }

    signUp(profile: INetworkUserProfile): void {
        this.http.post(`${this.constants.URI}/profile`, profile).subscribe(
            (response: Response) => {
                const TITLE = 'Success';
                const CONTENT = `User "${profile.username}" is signed up!`;
                this.alertService.alertSuccess(TITLE, CONTENT);

                this.userProfile.copyProfile(profile);

                this.socketService.connect(profile.username);
                this.router.navigateByUrl('/main');
                this.dialogService.openDialog(PromptTutorialComponent);
            },
            (error) => {
                if (error.status === 400) {
                    const TITLE = `Error ${error.status}`;
                    const CONTENT = `User "${profile.username}" already exists!`;
                    this.alertService.alertError(TITLE, CONTENT);
                }
            },
        );
    }

    signOut(): void {
        const options = { headers: { username: this.userProfile.username } };
        this.http.delete(`${this.constants.URI}/session`, options).subscribe((response: Response) => {
            const TITLE = 'Success';
            const CONTENT = `User "${this.userProfile.username}" is signed out`;
            this.alertService.alertSuccess(TITLE, CONTENT);

            this.themeService.resetDarkTheme();
            this.userProfile.clear();
            this.socketService.disconnect();
            this.router.navigateByUrl('/signin');
        });
    }

    getProfile(username: string): Observable<any> {
        return this.http.get(`${this.constants.URI}/profile/${username}`);
    }

    getUserProfileAndConnectWindow(username: string): void {
        this.getProfile(username).subscribe((profile: INetworkUserProfile) => {
            this.userProfile.copyProfile(profile);
            this.themeService.initialiseTheme(this.userProfile.theme);
            this.socketService.connect(username);
        });
    }

    private getUserProfileAndConnect(username: string): void {
        this.getProfile(username).subscribe((profile: INetworkUserProfile) => {
            this.userProfile.copyProfile(profile);
            this.themeService.initialiseTheme(this.userProfile.theme);

            const TITLE = 'Success';
            const CONTENT = `User "${username}" is signed in!`;
            this.alertService.alertSuccess(TITLE, CONTENT);

            this.socketService.connect(username);
            this.router.navigateByUrl('/main');
        });
    }
}
