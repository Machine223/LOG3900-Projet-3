import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subscriber } from 'src/app/helpers/subscriber';
import { Game } from '../../game-family/game';

@Component({
    selector: 'app-hint',
    templateUrl: './hint.component.html',
    styleUrls: ['./hint.component.scss'],
})
export class HintComponent extends Subscriber implements OnInit {
    @ViewChild('latestMessage') latestMessage: ElementRef;
    @Input() game: Game;
    hints: string[];

    constructor() {
        super();
        this.hints = [];
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this.game.isTurnActive.subscribe((isTurnActive: boolean) => {
                if (isTurnActive) {
                    this.hints = [];
                }
            }),
            this.game.newHintAsked.subscribe((newHint: string) => this.hints.push(newHint)),
        );
    }

    hintAsked(): void {
        this.game.getNewHint();
        this.scrollToBottom();
    }

    private scrollToBottom(): void {
        setTimeout(() => {
            this.latestMessage.nativeElement.scrollIntoView();
        }, 0);
    }
}
