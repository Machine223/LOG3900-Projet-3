import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatIOService } from 'src/app/services/chat-io/chat-io.service';

@Component({
    selector: 'app-composer',
    templateUrl: './composer.component.html',
    styleUrls: ['./composer.component.scss'],
})
export class ComposerComponent implements OnInit {
    @ViewChild('composer', { static: false }) composer: ElementRef;
    composedMessage: string;

    constructor(private chatIOService: ChatIOService) {
        this.composedMessage = '';
    }

    onSend(event: Event): void {
        event.preventDefault();
        this.chatIOService.sendMessage(this.composedMessage);
        this.composedMessage = '';
        this.composer.nativeElement.focus();
    }

    ngOnInit(): void {
        this.composer.nativeElement.focus();
    }
}
