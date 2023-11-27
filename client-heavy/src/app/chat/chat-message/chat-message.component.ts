import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProfileManagerService } from 'src/app/profile/profile-manager.service';
import { IChatMessage } from './chat-message';

@Component({
    selector: 'app-chat-message',
    templateUrl: './chat-message.component.html',
    styleUrls: ['./chat-message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessageComponent {
    @Input()
    readonly message: IChatMessage;

    constructor(private profileManager: ProfileManagerService) {}

    timestampToString(timestamp: number = this.message.timestamp): string {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        return new Date(timestamp).toLocaleTimeString('en-US', options);
    }

    isAuthor(author: string = this.message.author): boolean {
        return this.profileManager.userProfile.username === author;
    }
}
