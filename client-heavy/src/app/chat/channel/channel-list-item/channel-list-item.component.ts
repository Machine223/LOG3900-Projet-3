import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { DialogService } from 'src/app/pop-up/dialog/dialog.service';
import { ZoomService } from '../../zoom.service';
import { Channel } from '../channel';
import { PromptDeleteChannelComponent } from './prompt-delete-channel/prompt-delete-channel.component';

@Component({
    selector: 'app-channel-list-item',
    templateUrl: './channel-list-item.component.html',
    styleUrls: ['./channel-list-item.component.scss'],
})
export class ChannelListItemComponent {
    @Input() channel: Channel;

    get isGeneral(): boolean {
        return this.channel.name === this.constants.GENERAL_CHANNEL_NAME;
    }

    get isVoiceChat(): boolean {
        return this.zoomService.currentChannel === this.channel.name;
    }

    constructor(private zoomService: ZoomService, private constants: ConstantsRepositoryService, private dialogService: DialogService) {}

    onJoin(event: MouseEvent): void {
        event.stopPropagation();
        this.channel.joinChannelEvent();
    }

    onLeave(event: MouseEvent): void {
        event.stopPropagation();
        this.channel.leaveChannelEvent();
    }

    onDelete(event: MouseEvent): void {
        const dialogRef: MatDialogRef<PromptDeleteChannelComponent> = this.dialogService.openDialog(PromptDeleteChannelComponent);
        dialogRef.componentInstance.channel = this.channel;
    }

    onLoad(): void {
        this.channel.loadChatHistory();
    }

    menuClicked(event: MouseEvent): void {
        event.stopPropagation();
    }
}
