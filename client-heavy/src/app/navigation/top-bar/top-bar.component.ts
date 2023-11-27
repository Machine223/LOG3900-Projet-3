import { Component, OnInit } from '@angular/core';
import { ChannelManagerService } from 'src/app/chat/channel-manager.service';
import { ChatWindowService } from 'src/app/chat/chat-window.service';
import { SoundPlayerService } from 'src/app/game/sound-player.service';
import { DialogService } from 'src/app/pop-up/dialog/dialog.service';
import { AvatarService } from 'src/app/profile/avatar/avatar.service';
import { ProfileManagerService } from 'src/app/profile/profile-manager.service';
import { ProfileComponent } from 'src/app/profile/profile.component';
import { ViewOptionsService } from '../view-options.service';

@Component({
    selector: 'app-top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {
    username: string;
    avatar: string;

    constructor(
        private profileManager: ProfileManagerService,
        private avatarService: AvatarService,
        private dialogService: DialogService,
        public viewOptions: ViewOptionsService,
        public channelManager: ChannelManagerService,
        public chatWindow: ChatWindowService,
        public soundPlayer: SoundPlayerService,
    ) {}

    ngOnInit(): void {
        this.username = this.profileManager.userProfile.username;
        this.avatar = this.avatarService.avatars.get(this.profileManager.userProfile.avatarName);
    }

    onProfileSelect(): void {
        this.profileManager.updateStatsAndHistory();
        this.dialogService.openDialog(ProfileComponent);
    }

    onChatToggle(): void {
        if (!this.chatWindow.isDetached) {
            this.viewOptions.isChatSideNavOpened = !this.viewOptions.isChatSideNavOpened;
            if (!this.viewOptions.isChatSideNavOpened) {
                this.channelManager.unselectChannel();
            }
        }
    }

    onMuteToggle(): void {
        this.soundPlayer.toggleMute();
    }
}
