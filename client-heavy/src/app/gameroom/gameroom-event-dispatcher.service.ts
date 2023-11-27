import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from '../chat/socket.service';
import { INetworkWordGoodGuess } from '../game/game-network-interface/network-game-word-good-guess';
import { ConstantsRepositoryService } from '../helpers/constants-repository.service';
import { TutorialService } from '../tutorial/tutorial.service';
import { GameroomManagerService } from './gameroom-manager.service';
import { INetworkGameroom } from './gameroom-network-interface/network-gameroom';
import { INetworkGameroomDelete } from './gameroom-network-interface/network-gameroom-delete';
import { INetworkGameroomEdit } from './gameroom-network-interface/network-gameroom-edit';
import { INetworkEndGame } from './gameroom-network-interface/network-gameroom-end';
import { INetworkStartGame } from './gameroom-network-interface/network-gameroom-start';

@Injectable({
    providedIn: 'root',
})
export class GameroomEventDispatcherService {
    private subscriptions: Subscription[];
    constructor(
        private socketService: SocketService,
        private gameroomManager: GameroomManagerService,
        private constants: ConstantsRepositoryService,
        private tutorial: TutorialService,
    ) {
        this.addTutorialListeners();

        this.subscriptions = [];
        this.socketService.isConnectedObservable.subscribe((isConnected: boolean) => {
            if (isConnected) {
                this.addSocketListeners();
                this.gameroomManager.updateGameRooms();
            } else {
                this.removeListeners();
                this.gameroomManager.resetGamerooms();
            }
        });
    }

    addSocketListeners(): void {
        this.subscriptions.push(
            this.socketService.listen(this.constants.GAMEROOM_NEW).subscribe((dataString: string) => {
                if (!this.tutorial.isTutorial) {
                    const newGameroom: INetworkGameroom = JSON.parse(dataString) as INetworkGameroom;
                    this.gameroomManager.addGameroom(newGameroom);
                }
            }),
        );

        this.subscriptions.push(
            this.socketService.listen(this.constants.GAMEROOM_DELETE).subscribe((dataString: string) => {
                if (!this.tutorial.isTutorial) {
                    const gameroomToDelete: INetworkGameroomDelete = JSON.parse(dataString) as INetworkGameroomDelete;
                    this.gameroomManager.deleteGameroom(gameroomToDelete);
                }
            }),
        );

        this.subscriptions.push(
            this.socketService.listen(this.constants.GAMEROOM_ADD_USER).subscribe((dataString: string) => {
                if (!this.tutorial.isTutorial) {
                    const newUserEdit: INetworkGameroomEdit = JSON.parse(dataString) as INetworkGameroomEdit;
                    this.gameroomManager.addUserToGameroom(newUserEdit);
                }
            }),
        );

        this.subscriptions.push(
            this.socketService.listen(this.constants.GAMEROOM_REMOVE_USER).subscribe((dataString: string) => {
                if (!this.tutorial.isTutorial) {
                    const removeUserEdit: INetworkGameroomEdit = JSON.parse(dataString) as INetworkGameroomEdit;
                    this.gameroomManager.removeUserFromGameroom(removeUserEdit);
                }
            }),
        );

        this.subscriptions.push(
            this.socketService.listen(this.constants.GAME_START).subscribe((dataString: string) => {
                if (!this.tutorial.isTutorial) {
                    const startgame: INetworkStartGame = JSON.parse(dataString) as INetworkStartGame;
                    this.gameroomManager.startGame(startgame);
                }
            }),
        );

        this.subscriptions.push(
            this.socketService.listen(this.constants.GAME_END).subscribe((dataString: string) => {
                if (!this.tutorial.isTutorial) {
                    const endGame: INetworkEndGame = JSON.parse(dataString) as INetworkEndGame;
                    this.gameroomManager.endGame(endGame);
                }
            }),
        );
    }

    addTutorialListeners(): void {
        this.tutorial.onStartTutorial.subscribe(() => {
            this.gameroomManager.updateGameRooms();
        });

        this.tutorial.onNewGameroom.subscribe((newGameroom: INetworkGameroom) => {
            this.gameroomManager.addGameroom(newGameroom);
        });

        this.tutorial.onGoodGuess.subscribe((goodGuess: INetworkWordGoodGuess) => {
            const gameroomToDelete: INetworkGameroomDelete = {
                gameroomName: goodGuess.gameroomName,
            };
            this.gameroomManager.deleteGameroom(gameroomToDelete);
            const mockGamerooms = this.tutorial.getAllGamerooms();
            for (const mockGameroom of mockGamerooms) {
                const gameroom: INetworkGameroomDelete = {
                    gameroomName: mockGameroom.gameroomName,
                };
                this.gameroomManager.deleteGameroom(gameroom);
            }
        });

        this.tutorial.onAddUserGameroom.subscribe((newUserEdit: INetworkGameroomEdit) => {
            this.gameroomManager.addUserToGameroom(newUserEdit);
        });

        this.tutorial.onAddVirtualPlayer.subscribe((newUserEdit: INetworkGameroomEdit) => {
            this.gameroomManager.addUserToGameroom(newUserEdit);
        });

        this.tutorial.onStartGame.subscribe((startgame: INetworkStartGame) => {
            this.gameroomManager.startGame(startgame);
        });
    }

    removeListeners(): void {
        this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
