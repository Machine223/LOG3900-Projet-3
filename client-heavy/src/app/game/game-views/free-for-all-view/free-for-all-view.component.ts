import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DialogService } from 'src/app/pop-up/dialog/dialog.service';
import { GameMode } from 'src/app/profile/user-profile/history/game-information/game-mode';
import { TutorialService } from 'src/app/tutorial/tutorial.service';
import { MeleeGame } from '../../game-family/melee/melee';
import { Role } from '../../game-family/melee/role';
import { GameLocalStateService } from '../../game-local-state.service';
import { WordChoiceComponent } from '../../word-choice/word-choice.component';
import { EndGameViewComponent } from '../end-game-view/end-game-view.component';

@Component({
    selector: 'app-free-for-all-view',
    templateUrl: './free-for-all-view.component.html',
    styleUrls: ['./free-for-all-view.component.scss'],
})
export class FreeForAllViewComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() game: MeleeGame;
    isTurnActive: boolean;
    subscriptions: Subscription[];

    private dialogRef: MatDialogRef<WordChoiceComponent, any>;
    public get role(): typeof Role {
        return Role;
    }

    public get gameMode(): typeof GameMode {
        return GameMode;
    }

    constructor(private dialog: DialogService, private gameStateService: GameLocalStateService, public tutorial: TutorialService) {
        this.subscriptions = [];
    }

    ngOnInit(): void {
        this.dialogRef = this.dialog.openDialog(WordChoiceComponent);

        this.subscriptions.push(
            this.game.isTurnActive.subscribe((isTurnActive: boolean) => (isTurnActive ? this.manageTurnStart() : this.manageTurnEnd())),
            this.game.isWordChoicesShownObservable.subscribe((isWordChoicesShown: boolean) => {
                if (isWordChoicesShown) {
                    if (!this.dialogRef.componentInstance) {
                        this.dialogRef = this.dialog.openDialog(WordChoiceComponent);
                    }
                    this.dialogRef.componentInstance.game = this.game;
                } else {
                    this.dialogRef.close();
                }
            }),
        );
    }
    ngAfterViewInit(): void {
        if (this.tutorial.isTutorial) {
            this.tutorial.nextStep();
        }
    }

    manageTurnStart(): void {
        this.isTurnActive = true;
    }

    manageTurnEnd(): void {
        this.isTurnActive = false;
    }

    ngOnDestroy(): void {
        this.gameStateService.muteAndDeafen();
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
        this.subscriptions = [];
        if (!this.tutorial.isTutorial) {
            this.dialog.openDialog(EndGameViewComponent, false);
        }
    }
}
