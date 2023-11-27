import { Component, OnInit } from '@angular/core';
import { ChatIOService } from 'src/app/services/chat-io/chat-io.service';

@Component({
    selector: 'app-chat-header',
    templateUrl: './chat-header.component.html',
    styleUrls: ['./chat-header.component.scss'],
})
export class ChatHeaderComponent implements OnInit {
    username: string;

    constructor(private chatIOService: ChatIOService) {}

    ngOnInit(): void {
        this.username = this.chatIOService.username;
    }

    logOut() {
        this.chatIOService.logOut();
    }
}
