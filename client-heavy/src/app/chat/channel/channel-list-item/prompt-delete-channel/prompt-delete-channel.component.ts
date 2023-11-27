import { Component } from '@angular/core';
import { Channel } from '../../channel';

@Component({
    selector: 'app-prompt-delete-channel',
    templateUrl: './prompt-delete-channel.component.html',
    styleUrls: ['./prompt-delete-channel.component.scss'],
})
export class PromptDeleteChannelComponent {
    channel: Channel;
    constructor() {}

    onDelete(): void {
        this.channel.deleteChannelEvent();
    }
}
