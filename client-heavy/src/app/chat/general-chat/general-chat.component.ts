import { Component } from '@angular/core';
import { ChannelManagerService } from '../channel-manager.service';

@Component({
    selector: 'app-general-chat',
    templateUrl: './general-chat.component.html',
    styleUrls: ['./general-chat.component.scss'],
})
export class GeneralChatComponent {
    constructor(public channelManager: ChannelManagerService) {}
}
