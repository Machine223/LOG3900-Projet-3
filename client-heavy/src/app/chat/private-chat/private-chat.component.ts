import { Component } from '@angular/core';
import { ChannelManagerService } from '../channel-manager.service';

@Component({
    selector: 'app-private-chat',
    templateUrl: './private-chat.component.html',
    styleUrls: ['./private-chat.component.scss'],
})
export class PrivateChatComponent {
    constructor(public channelManager: ChannelManagerService) {}
}
