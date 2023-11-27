import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { MeleeGame } from 'src/app/game/game-family/melee/melee';
import { GameManagerService } from 'src/app/game/game-manager.service';
import { INetworkNewScore } from 'src/app/game/game-network-interface/network-game-new-score';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { Subscriber } from 'src/app/helpers/subscriber';
import { ProfileManagerService } from 'src/app/profile/profile-manager.service';

@Component({
    selector: 'app-leaderboard-item',
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
    templateUrl: './leaderboard-item.component.html',
    styleUrls: ['./leaderboard-item.component.scss'],
})
export class LeaderboardItemComponent extends Subscriber implements OnInit {
    @Input() user: string;
    game: MeleeGame;
    score: number;
    isGoodGuess: boolean;
    isBadGuess: boolean;
    isSelf: boolean;
    isVirtual: boolean;
    isDrawer: boolean;

    constructor(
        private gameManager: GameManagerService,
        private profileManager: ProfileManagerService,
        private constants: ConstantsRepositoryService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.game = this.gameManager.currentGame as MeleeGame;
        this.score = 0;
        this.isGoodGuess = false;
        this.isBadGuess = false;
        this.isSelf = this.profileManager.userProfile.username === this.user;
        this.isVirtual = this.constants.VIRTUAL_PLAYER_NAMES.has(this.user);

        this.subscriptions.push(
            this.game.scoreObservable.subscribe((score: INetworkNewScore) => {
                if (score.username === this.user) {
                    this.score = Math.round(score.score);
                }
            }),
            this.game.isTurnActive.subscribe((isTurnActive: boolean) => {
                if (!isTurnActive) {
                    this.isGoodGuess = false;
                    this.isBadGuess = false;
                }
            }),
            this.game.goodGuessEvent.subscribe((user: string) => {
                if (user === this.user) {
                    this.isGoodGuess = true;
                }
            }),
            this.game.badGuessEvent.subscribe((user: string) => {
                if (user === this.user) {
                    this.isBadGuess = true;
                    setTimeout(() => {
                        this.isBadGuess = false;
                    }, 0);
                }
            }),
        );
    }
}
