import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { DialogService } from 'src/app/pop-up/dialog/dialog.service';
import { ChannelManagerService } from '../../channel-manager.service';
import { Channel } from '../../channel/channel';
import { PromptDeleteChannelComponent } from '../../channel/channel-list-item/prompt-delete-channel/prompt-delete-channel.component';
import { ChatWindowService } from '../../chat-window.service';

@Component({
    selector: 'app-chat-header',
    templateUrl: './chat-header.component.html',
    styleUrls: ['./chat-header.component.scss'],
})
export class ChatHeaderComponent {
    @Input() channel: Channel;
    @Input() isDetached: boolean;

    get isGeneral(): boolean {
        return this.channel.name === this.constants.GENERAL_CHANNEL_NAME;
    }

    constructor(
        public channelManager: ChannelManagerService,
        private chatWindowService: ChatWindowService,
        private constants: ConstantsRepositoryService,
        private dialogService: DialogService,
    ) {}

    onBack(): void {
        this.channelManager.unselectChannel();
    }

    onLeave(): void {
        this.channel.leaveChannelEvent();
    }

    onGetHistory(): void {
        this.channel.loadChatHistory();
    }

    onDelete(): void {
        const dialogRef: MatDialogRef<PromptDeleteChannelComponent> = this.dialogService.openDialog(PromptDeleteChannelComponent);
        dialogRef.componentInstance.channel = this.channel;
    }

    onDetachChat(): void {
        this.chatWindowService.detachChatWindow();
    }
}
