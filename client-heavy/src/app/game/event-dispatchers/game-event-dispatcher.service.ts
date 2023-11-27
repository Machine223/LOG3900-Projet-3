import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/chat/socket.service';
import { INetworkStartGame } from 'src/app/gameroom/gameroom-network-interface/network-gameroom-start';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { ProfileManagerService } from 'src/app/profile/profile-manager.service';
import { TutorialService } from 'src/app/tutorial/tutorial.service';
import { GameManagerService } from '../game-manager.service';
import { INetworkAttemptConsumed } from '../game-network-interface/network-game-attempt-consumed';
import { INetworkHintAsked } from '../game-network-interface/network-game-hint-asked';
import { INetworkNewScore } from '../game-network-interface/network-game-new-score';
import { INetworkTurnEnd } from '../game-network-interface/network-game-turn-end';
import { INetworkTurnInfo } from '../game-network-interface/network-game-turn-info';
import { INetworkTurnStart } from '../game-network-interface/network-game-turn-start';
import { INetworkWordBadGuess } from '../game-network-interface/network-game-word-bad-guess';
import { INetworkWordChoice } from '../game-network-interface/network-game-word-choice';
import { INetworkWordGoodGuess } from '../game-network-interface/network-game-word-good-guess';

@Injectable({
    providedIn: 'root',
})
export class GameEventDispatcherService {
    private subscriptions: Subscription[];
    constructor(
        private socketService: SocketService,
        private gameManager: GameManagerService,
        private constants: ConstantsRepositoryService,
        private tutorial: TutorialService,
        private profileManager: ProfileManagerService,
    ) {
        this.addTutorialListeners();

        this.subscriptions = [];
        socketService.isConnectedObservable.subscribe((isSocketConnected: boolean) => {
            if (isSocketConnected) {
                this.addSocketListeners();
            } else {
                this.removeListeners();
                gameManager.reset();
            }
        });
    }

    addSocketListeners(): void {
        this.subscriptions.push(
            this.socketService.listen(this.constants.TURN_INFO).subscribe((dataString: string) => {
                const turnInfo: INetworkTurnInfo = JSON.parse(dataString) as INetworkTurnInfo;
                this.gameManager.newTurnInfo(turnInfo);
            }),
        );

        this.subscriptions.push(
            this.socketService.listen(this.constants.WORD_CHOICE).subscribe((dataString: string) => {
                const wordChoice: INetworkWordChoice = JSON.parse(dataString) as INetworkWordChoice;
                this.gameManager.newWordChoice(wordChoice);
            }),
        );

        this.subscriptions.push(
            this.socketService.listen(this.constants.TURN_START).subscribe((dataString: string) => {
                const turnStart: INetworkTurnStart = JSON.parse(dataString) as INetworkTurnStart;
                this.gameManager.turnStart(turnStart);
            }),
        );

        this.subscriptions.push(
            this.socketService.listen(this.constants.TURN_END).subscribe((dataString: string) => {
                const turnEnd: INetworkTurnEnd = JSON.parse(dataString) as INetworkTurnEnd;
                this.gameManager.turnEnd(turnEnd);
            }),
        );

        this.subscriptions.push(
            this.socketService.listen(this.constants.GOOD_GUESS).subscribe((dataString: string) => {
                const goodGuess: INetworkWordGoodGuess = JSON.parse(dataString) as INetworkWordGoodGuess;
                this.gameManager.goodGuess(goodGuess);
            }),
        );

        this.subscriptions.push(
            this.socketService.listen(this.constants.BAD_GUESS).subscribe((dataString: string) => {
                const badGuess: INetworkWordBadGuess = JSON.parse(dataString) as INetworkWordBadGuess;
                this.gameManager.badGuess(badGuess);
            }),
        );

        this.subscriptions.push(
            this.socketService.listen(this.constants.NEW_SCORE).subscribe((dataString: string) => {
                const newScore: INetworkNewScore = JSON.parse(dataString) as INetworkNewScore;
                this.gameManager.newScore(newScore);
            }),
        );

        this.subscriptions.push(
            this.socketService.listen(this.constants.ATTEMPT_CONSUMED).subscribe((dataString: string) => {
                const attemptConsumed: INetworkAttemptConsumed = JSON.parse(dataString) as INetworkAttemptConsumed;
                this.gameManager.attemptConsumed(attemptConsumed);
            }),
        );

        this.subscriptions.push(
            this.socketService.listen(this.constants.HINT_ASKED).subscribe((dataString: string) => {
                const hintAsked: INetworkHintAsked = JSON.parse(dataString) as INetworkHintAsked;
                this.gameManager.hintAsked(hintAsked);
            }),
        );
    }

    addTutorialListeners(): void {
        this.tutorial.onStartGame.subscribe((startgame: INetworkStartGame) => {
            const user = this.profileManager.userProfile.username;
            this.gameManager.newTurnInfo(this.tutorial.drawerTurnInfo(user));
            this.gameManager.turnStart(this.tutorial.turnStart());
        });

        this.tutorial.onTurnEnd.subscribe(() => {
            this.gameManager.turnEnd({});
            this.gameManager.newTurnInfo(this.tutorial.guesserTurnInfo());
            this.gameManager.turnStart(this.tutorial.turnStart());
        });

        this.tutorial.onGoodGuess.subscribe((goodGuess: INetworkWordGoodGuess) => {
            this.gameManager.goodGuess(goodGuess);
            setTimeout(() => {
                this.gameManager.turnEnd({});
                this.gameManager.endGame();
            }, 800);
        });

        this.tutorial.onBadGuess.subscribe((badGuess: INetworkWordBadGuess) => {
            this.gameManager.badGuess(badGuess);
        });
    }

    removeListeners(): void {
        this.subscriptions.forEach((subcription: Subscription) => {
            subcription.unsubscribe();
        });
        this.subscriptions = [];
    }
}
