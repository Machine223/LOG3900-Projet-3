import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DialogService } from 'src/app/pop-up/dialog/dialog.service';
import { GameMode } from 'src/app/profile/user-profile/history/game-information/game-mode';
import { SprintGame } from '../../game-family/sprint-game';
import { EndGameViewComponent } from '../end-game-view/end-game-view.component';

@Component({
    selector: 'app-sprint-view',
    templateUrl: './sprint-view.component.html',
    styleUrls: ['./sprint-view.component.scss'],
})
export class SprintViewComponent implements OnInit, OnDestroy {
    @Input() game: SprintGame;

    isTurnActive: boolean;

    subscriptions: Subscription[];

    public get gameMode(): typeof GameMode {
        return GameMode;
    }

    constructor(private dialog: DialogService) {
        this.subscriptions = [];
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this.game.isTurnActive.subscribe((isTurnActive: boolean) => (isTurnActive ? this.manageTurnStart() : this.manageTurnEnd())),
        );
    }

    manageTurnStart(): void {
        this.isTurnActive = true;
    }

    manageTurnEnd(): void {
        this.isTurnActive = false;
    }

    ngOnDestroy(): void {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
        this.subscriptions = [];
        this.dialog.openDialog(EndGameViewComponent, false);
    }
}
