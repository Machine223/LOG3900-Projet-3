import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subscriber } from 'src/app/helpers/subscriber';
import { Game } from '../../game-family/game';
import { MeleeGame } from '../../game-family/melee/melee';
import { SprintGame } from '../../game-family/sprint-game';

@Component({
    selector: 'app-guess-box',
    templateUrl: './guess-box.component.html',
    styleUrls: ['./guess-box.component.scss'],
})
export class GuessBoxComponent extends Subscriber implements OnInit, AfterViewInit {
    @ViewChild('composer', { static: false }) composer: ElementRef;
    @Input() game: Game;
    currentGuess: string;

    constructor() {
        super();
        this.currentGuess = '';
    }

    ngOnInit(): void {
        this.subscriptions.push(this.game.isTurnActive.subscribe((isTurnActive: boolean) => (this.currentGuess = '')));
    }

    ngAfterViewInit(): void {
        if (this.game instanceof SprintGame) {
            this.subscriptions.push(
                this.game.isTurnActive.subscribe((isActiveTurn: boolean) => {
                    if (isActiveTurn) {
                        setTimeout(() => this.composer.nativeElement.focus(), 0);
                    }
                }),
            );
        } else if (this.game instanceof MeleeGame) {
            this.subscriptions.push(
                this.game.isWordChoicesShownObservable.subscribe((isDialogShown: boolean) => {
                    if (!isDialogShown) {
                        setTimeout(() => this.composer.nativeElement.focus(), 0);
                    }
                }),
            );
        }
    }

    tryEvent(): void {
        if (this.currentGuess.trim() !== '') {
            this.game.guessTryEvent(this.currentGuess.trim());
        }
        this.currentGuess = '';
    }
}
