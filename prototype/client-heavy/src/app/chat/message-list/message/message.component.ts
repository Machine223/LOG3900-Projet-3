import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../../message';
import { ChatIOService } from 'src/app/services/chat-io/chat-io.service';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
    @Input()
    readonly message: Message;

    constructor(private chatIOService: ChatIOService) {}

    ngOnInit(): void {}

    timestampToString(timestamp: number = this.message.timestamp): string {
        var options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        return new Date(timestamp).toLocaleTimeString('en-CA', options);
    }

    isAuthor(author: string = this.message.author): boolean {
        return this.chatIOService.username === author;
    }
}
