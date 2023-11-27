import { Component, Input } from '@angular/core';
import { Channel } from './channel';

@Component({
    selector: 'app-channel',
    templateUrl: './channel.component.html',
    styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent {
    @Input() selectedChannel: Channel;
    @Input() isGameView: boolean;
    @Input() isDetached: boolean;

    constructor() {}

    sendNewMessage(message: string): void {
        this.selectedChannel.sendNewMessageEvent(message);
    }
}
