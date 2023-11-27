import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { AlertService } from 'src/app/pop-up/alert/alert.service';
import { TutorialService } from 'src/app/tutorial/tutorial.service';
import { ProfileManagerService } from '../profile-manager.service';
import { INetworkUserProfile } from '../user-profile/network-user-profile';
import { INetworkAvatar } from './network-avatar';

type AvatarCallback = (name: string) => void;

@Injectable({
    providedIn: 'root',
})
export class AvatarService {
    avatars: Map<string, string>;
    virtualAvatars: Map<string, string>;
    userAvatars: Map<string, string>;
    tutorialAvatars: Map<string, string>;
    userAvatarCallbacks: Map<string, AvatarCallback[]>;

    constructor(
        private http: HttpClient,
        private constants: ConstantsRepositoryService,
        private alertService: AlertService,
        private profileManager: ProfileManagerService,
        private tutorial: TutorialService,
    ) {
        const tutorialPlayers: readonly (readonly [string, string])[] = [
            ['Player 1', 'yoda'],
            ['Player 2', 'stormtrooper'],
            ['Player 3', 'jake'],
            ['Player 4', 'mystique'],
            ['Player 5', 'wonder_woman'],
            ['Player 6', 'spider_man'],
            ['Player 7', 'sonic'],
            ['Player 8', 'spyro'],
        ];
        this.avatars = new Map<string, string>();
        this.virtualAvatars = new Map<string, string>();
        this.userAvatars = new Map<string, string>();
        this.tutorialAvatars = new Map<string, string>(tutorialPlayers);
        this.userAvatarCallbacks = new Map<string, AvatarCallback[]>();
    }

    getAllAvatars(): void {
        this.http.get(`${this.constants.URI}/avatar/all`).subscribe(
            (response: any) => {
                const avatars: INetworkAvatar[] = response.avatars;
                for (const avatar of avatars) {
                    this.avatars.set(avatar.name, avatar.svg);
                }
            },
            (error) => {
                const TITLE = `Error ${error.status}`;
                const CONTENT = `Could not load avatars from server`;
                this.alertService.alertError(TITLE, CONTENT);
            },
        );

        this.http.get(`${this.constants.URI}/avatar/all-virtual`).subscribe(
            (response: any) => {
                const virtualAvatars: INetworkAvatar[] = response.avatars;
                for (const virtualAvatar of virtualAvatars) {
                    this.virtualAvatars.set(virtualAvatar.name, virtualAvatar.svg);
                }
            },
            (error) => {
                const TITLE = `Error ${error.status}`;
                const CONTENT = `Could not load virtual avatars from server`;
                this.alertService.alertError(TITLE, CONTENT);
            },
        );
    }

    getAvatar(username: string, callback: AvatarCallback): void {
        if (this.constants.VIRTUAL_PLAYER_NAMES.has(username)) {
            callback(this.virtualAvatars.get(username));
        } else if (this.tutorial.isTutorial && username !== this.profileManager.userProfile.username) {
            callback(this.avatars.get(this.tutorialAvatars.get(username)));
        } else {
            const avatarName = this.userAvatars.get(username);
            if (!avatarName) {
                this.addUserAvatar(username, callback);
            } else if (avatarName === this.constants.AVATAR_IS_LOADING) {
                this.userAvatarCallbacks.get(username).push(callback);
            } else {
                callback(this.avatars.get(avatarName));
            }
        }
    }

    private addUserAvatar(username: string, callback: AvatarCallback): void {
        this.userAvatars.set(username, this.constants.AVATAR_IS_LOADING);
        this.userAvatarCallbacks.set(username, [callback]);

        this.profileManager.getProfile(username).subscribe((profile: INetworkUserProfile) => {
            if (profile) {
                this.userAvatars.set(profile.username, profile.avatarName);
                this.executeCallbacks(profile);
            }
        });
    }

    private executeCallbacks(profile: INetworkUserProfile): void {
        for (const callback of this.userAvatarCallbacks.get(profile.username)) {
            callback(this.avatars.get(profile.avatarName));
        }
        this.userAvatarCallbacks.set(profile.username, []);
    }
}
