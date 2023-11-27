import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConstantsRepositoryService } from '../helpers/constants-repository.service';
import { AlertService } from '../pop-up/alert/alert.service';
import { INetworkTheme } from './network-theme';
import { Theme } from './profile-account/theme';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private _theme: Theme;
    private _isDark: boolean;
    private _initialTheme: Theme;
    private _themeSubject: BehaviorSubject<Theme>;
    themeObservable: Observable<Theme>;

    get isDark(): boolean {
        return this._isDark;
    }

    get theme(): Theme {
        return this._theme;
    }

    set theme(theme: Theme) {
        this._theme = theme;
        this.updateDarkTheme();
    }

    constructor(private http: HttpClient, private constants: ConstantsRepositoryService, private alertService: AlertService) {
        this._isDark = false;
        this._initialTheme = Theme.Light;
        this._theme = Theme.Light;

        this._themeSubject = new BehaviorSubject<Theme>(this._theme);
        this.themeObservable = this._themeSubject.asObservable();

        setInterval((() => this.checkNighttime()) as TimerHandler, 60000);
    }

    initialiseTheme(theme: Theme): void {
        this._theme = theme;
        this._initialTheme = theme;
        this.updateDarkTheme();
    }

    updateTheme(username: string): void {
        if (this._initialTheme !== this._theme) {
            const selectedTheme: INetworkTheme = { username, theme: this._theme };
            this.http.put(`${this.constants.URI}/profile/theme`, selectedTheme).subscribe(
                (response: Response) => {
                    this._initialTheme = this._theme;

                    const TITLE = 'Success';
                    const CONTENT = `Theme is saved!`;
                    this.alertService.alertSuccess(TITLE, CONTENT);
                },
                (error) => {
                    if (error.status === 400) {
                        const TITLE = `Error ${error.status}`;
                        const CONTENT = `Failed to save theme!`;
                        this.alertService.alertError(TITLE, CONTENT);
                    }
                },
            );
        }
    }

    resetDarkTheme(): void {
        this._isDark = false;
        this._initialTheme = Theme.Light;
        this._theme = Theme.Light;
    }

    private checkNighttime(): void {
        if (this._theme === Theme.Automatic) {
            const date = new Date();
            const hours = date.getHours();
            this._isDark = hours < 6 || hours >= 20;
        }
    }

    private updateDarkTheme(): void {
        switch (this._theme) {
            case Theme.Light:
                this._isDark = false;
                break;
            case Theme.Dark:
                this._isDark = true;
                break;
            case Theme.Automatic:
                this.checkNighttime();
                break;
            default:
                break;
        }
        this._themeSubject.next(this._theme);
    }
}
