import { Component, OnInit } from '@angular/core';
import { ProfileManagerService } from '../profile-manager.service';
import { ThemeService } from '../theme.service';

@Component({
    selector: 'app-profile-account',
    templateUrl: './profile-account.component.html',
    styleUrls: ['./profile-account.component.scss'],
})
export class ProfileAccountComponent implements OnInit {
    firstName: string;
    lastName: string;
    username: string;

    constructor(private profileManager: ProfileManagerService, public themeService: ThemeService) {}

    ngOnInit(): void {
        this.firstName = this.profileManager.userProfile.firstName;
        this.lastName = this.profileManager.userProfile.lastName;
        this.username = this.profileManager.userProfile.username;
    }
}
