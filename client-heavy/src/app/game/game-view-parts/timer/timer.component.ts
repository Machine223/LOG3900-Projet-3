import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Subscriber } from 'src/app/helpers/subscriber';
import { TutorialService } from 'src/app/tutorial/tutorial.service';
import { Game } from '../../game-family/game';

@Component({
    selector: 'app-timer',
    animations: [
        trigger('alert', [
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
            transition('event => calm', [animate('0.25s')]),
            transition('calm => event', [animate('0.25s')]),
        ]),
    ],
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss'],
})
export class TimerComponent extends Subscriber implements OnInit, OnDestroy {
    @Input() game: Game;
    private timerIntervalId: number;
    private alertIntervalId: number;
    formatedTimes: string;
    isAlert: boolean;

    constructor(private tutorial: TutorialService) {
        super();
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this.game.isTurnActive.subscribe((isTurnActive: boolean) => (isTurnActive ? this.manageTurnStart() : this.manageTurnEnd())),
        );
        this.isAlert = false;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
        clearInterval(this.timerIntervalId);
        this.clearAlert();
    }

    private getMinutes(seconds: number): void {
        if (seconds < 0) {
            /* tslint:disable:quotemark */
            this.formatedTimes = "Time's up";
            /* tslint:enable:quotemark */
        } else {
            const hours = seconds / 3600;
            const minutes = (seconds % 3600) / 60;
            const format = (value: number) => `0${Math.floor(value)}`.slice(-2);
            if (hours < 1) {
                this.formatedTimes = [minutes, seconds % 60].map(format).join(':');
            } else {
                this.formatedTimes = [hours, minutes, seconds % 60].map(format).join(':');
            }
        }
    }

    private updateTimer(): void {
        this.getMinutes(this.game.timeLeft);
        if (!this.alertIntervalId && this.game.timeLeft <= 10) {
            this.alert();
        }
    }

    private manageTurnStart(): void {
        this.updateTimer();
        if (!this.tutorial.isTutorial) {
            this.timerIntervalId = setInterval((() => this.updateTimer()) as TimerHandler, 50);
        }
    }

    private manageTurnEnd(): void {
        clearInterval(this.timerIntervalId);
        this.clearAlert();
    }

    private alert(): void {
        this.alertIntervalId = setInterval((() => (this.isAlert = !this.isAlert)) as TimerHandler, 350);
    }

    private clearAlert(): void {
        if (this.alertIntervalId) {
            clearInterval(this.alertIntervalId);
            this.alertIntervalId = null;
            this.isAlert = false;
        }
    }
}
