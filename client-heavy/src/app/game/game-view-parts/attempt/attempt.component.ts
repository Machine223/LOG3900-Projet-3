import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Subscriber } from 'src/app/helpers/subscriber';
import { ProfileManagerService } from 'src/app/profile/profile-manager.service';
import { GameMode } from 'src/app/profile/user-profile/history/game-information/game-mode';
import { Game } from '../../game-family/game';

@Component({
    selector: 'app-attempt',
    templateUrl: './attempt.component.html',
    styleUrls: ['./attempt.component.scss'],
})
export class AttemptComponent extends Subscriber implements AfterViewInit {
    @ViewChild('latestMessage') latestMessage: ElementRef;
    @Input() game: Game;

    public get gameMode(): typeof GameMode {
        return GameMode;
    }

    constructor(private profileManager: ProfileManagerService) {
        super();
    }

    ngAfterViewInit(): void {
        this.subscriptions.push(
            this.game.badGuessEvent.subscribe((username: string) => {
                if (username === this.profileManager.userProfile.username) {
                    this.scrollToBottom();
                }
            }),
        );
    }

    private scrollToBottom(): void {
        setTimeout(() => {
            this.latestMessage.nativeElement.scrollIntoView();
        }, 0);
    }
}
