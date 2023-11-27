import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Game } from 'src/app/game/game-family/game';
import { GameManagerService } from 'src/app/game/game-manager.service';
import { Subscriber } from 'src/app/helpers/subscriber';
import { ProfileManagerService } from 'src/app/profile/profile-manager.service';

@Component({
    selector: 'app-player-answer-counter-item',
    animations: [
        trigger('goodGuess', [
            state(
                'event',
                style({
                    backgroundColor: 'green',
                    opacity: 0.5,
                }),
            ),
            state(
                'calm',
                style({
                    backgroundColor: 'green',
                    opacity: 0,
                }),
            ),
            transition('event => calm', [animate('1s')]),
        ]),
        trigger('badGuess', [
            state(
                'event',
                style({
                    backgroundColor: 'red',
                    opacity: 0.5,
                }),
            ),
            state(
                'calm',
                style({
                    backgroundColor: 'red',
                    opacity: 0,
                }),
            ),
            transition('event => calm', [animate('1s')]),
        ]),
    ],
    templateUrl: './player-answer-counter-item.component.html',
    styleUrls: ['./player-answer-counter-item.component.scss'],
})
export class PlayerAnswerCounterItemComponent extends Subscriber implements OnInit {
    @Input() user: string;
    private game: Game;
    nGoodGuess: number;
    nBadGuess: number;
    newGoodGuess: boolean;
    newBadGuess: boolean;

    get isMyself(): boolean {
        return this.user === this.profileManager.userProfile.username;
    }

    constructor(private gameManager: GameManagerService, private profileManager: ProfileManagerService) {
        super();
        this.nGoodGuess = 0;
        this.nBadGuess = 0;
        this.game = this.gameManager.currentGame;
        this.newGoodGuess = false;
        this.newBadGuess = false;
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this.game.goodGuessEvent.subscribe((user: string) => {
                if (user === this.user) {
                    this.nGoodGuess++;
                    this.newGoodGuess = true;
                    setTimeout(() => {
                        this.newGoodGuess = false;
                    }, 0);
                }
            }),
            this.game.badGuessEvent.subscribe((user: string) => {
                if (user === this.user) {
                    this.nBadGuess++;
                    this.newBadGuess = true;
                    setTimeout(() => {
                        this.newBadGuess = false;
                    }, 0);
                }
            }),
        );
    }
}
