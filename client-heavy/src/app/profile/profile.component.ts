import { Component } from '@angular/core';
import { ProfileManagerService } from './profile-manager.service';
import { ThemeService } from './theme.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./avatar/avatar.component.scss', './profile.component.scss'],
})
export class ProfileComponent {
    constructor(private profileManager: ProfileManagerService, private themeService: ThemeService) {}

    onOk(): void {
        this.profileManager.userProfile.theme = this.themeService.theme;
        this.themeService.updateTheme(this.profileManager.userProfile.username);
    }
}
