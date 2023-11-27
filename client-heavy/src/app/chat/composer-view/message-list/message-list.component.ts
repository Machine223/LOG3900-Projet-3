import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Subscriber } from 'src/app/helpers/subscriber';
import { ProfileManagerService } from 'src/app/profile/profile-manager.service';
import { Channel } from '../../channel/channel';

@Component({
    selector: 'app-message-list',
    templateUrl: './message-list.component.html',
    styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent extends Subscriber implements OnInit, OnChanges {
    @ViewChild('latestMessage') latestMessage: ElementRef;
    @Input() channel: Channel;

    constructor(private profileManager: ProfileManagerService) {
        super();
    }

    ngOnInit(): void {
        this.subscriptions.push(this.channel.onNewMessage.subscribe(() => this.scrollToBottom()));
        this.scrollToBottom();
    }

    ngOnChanges(): void {
        this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
        this.subscriptions = [];
        this.subscriptions.push(this.channel.onNewMessage.subscribe(() => this.scrollToBottom()));
        this.scrollToBottom();
    }

    private scrollToBottom(): void {
        setTimeout(() => {
            this.latestMessage.nativeElement.scrollIntoView();
        }, 0);
    }

    isAuthor(author: string): boolean {
        return this.profileManager.userProfile.username === author;
    }
}
