import { ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatIOService } from 'src/app/services/chat-io/chat-io.service';

import { Message } from '../message';

@Component({
    selector: 'app-message-list',
    templateUrl: './message-list.component.html',
    styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit, OnDestroy {
    @ViewChild('latestMessage') latestMessage: ElementRef;

    private subscriptions = new Subscription();
    messages: Message[];

    constructor(private chatIOService: ChatIOService) {
        this.messages = [];
    }

    ngOnInit(): void {
        this.chatIOService.newMessageSubject.subscribe(
            (newMessage: Message) => {
                this.messages.push(newMessage);
                this.scrollToBottom();
            }
        );
    }

    private scrollToBottom(): void {
        setTimeout(() => {
            this.latestMessage.nativeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 0);
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
