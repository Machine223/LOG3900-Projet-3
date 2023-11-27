import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { ProfileManagerService } from 'src/app/profile/profile-manager.service';

@Component({
    selector: 'app-lobby-player',
    templateUrl: './lobby-player.component.html',
    styleUrls: ['./lobby-player.component.scss'],
})
export class LobbyPlayerComponent {
    @Input() playerName: string;
    @Output() deleteVirtualPlayer: EventEmitter<string>;

    get isSelf(): boolean {
        return this.profile.userProfile.username === this.playerName;
    }

    constructor(public constants: ConstantsRepositoryService, private profile: ProfileManagerService) {
        this.deleteVirtualPlayer = new EventEmitter();
    }
}
