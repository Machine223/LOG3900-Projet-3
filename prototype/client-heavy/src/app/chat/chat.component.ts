import { Component, OnInit } from '@angular/core';
import { ChatIOService } from '../services/chat-io/chat-io.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
    constructor(private chatIOService: ChatIOService, private router: Router) {}

    ngOnInit(): void {
        if (!this.chatIOService.username) {
            this.router.navigateByUrl('/login');
        }
    }
}
