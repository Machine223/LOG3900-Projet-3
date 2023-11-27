import { Injectable } from '@angular/core';
import { GameManagerService } from '../game/game-manager.service';
import { ConstantsRepositoryService } from '../helpers/constants-repository.service';
import { ProfileManagerService } from '../profile/profile-manager.service';
import { GameMode } from '../profile/user-profile/history/game-information/game-mode';
import { Difficulty } from '../word-image-pair/enums/difficulty';
import { Gameroom } from './gameroom';
import { GameroomCommunicationsService } from './gameroom-communications.service';
import { INetworkGameroom } from './gameroom-network-interface/network-gameroom';
import { INetworkGameroomDelete } from './gameroom-network-interface/network-gameroom-delete';
import { INetworkGameroomEdit } from './gameroom-network-interface/network-gameroom-edit';
import { INetworkEndGame } from './gameroom-network-interface/network-gameroom-end';
import { INetworkStartGame } from './gameroom-network-interface/network-gameroom-start';

@Injectable({
    providedIn: 'root',
})
export class GameroomManagerService {
    /* tslint:disable */
    private _gameRooms: Map<string, Gameroom>;
    private _currentGameroom: Gameroom;
    /* tslint:enable */

    get gamerooms(): Map<string, Gameroom> {
        return this._gameRooms;
    }

    get currentGameroom(): Gameroom {
        return this._currentGameroom;
    }

    constructor(
        private gameroomCommunications: GameroomCommunicationsService,
        private profileManager: ProfileManagerService,
        private constants: ConstantsRepositoryService,
        private gameManager: GameManagerService,
    ) {
        this._gameRooms = new Map<string, Gameroom>();
        this._currentGameroom = undefined;
    }

    updateGameRooms(): void {
        this.gameroomCommunications.getAllGamerooms((gamerooms: INetworkGameroom[]) => {
            this._currentGameroom = undefined;
            this.gameManager.colorManager.gameroomName = undefined;
            this._gameRooms = new Map<string, Gameroom>();
            gamerooms.forEach((gameroom: INetworkGameroom) => {
                const newGameroom = new Gameroom(
                    this.gameroomCommunications,
                    this.constants,
                    gameroom.gameroomName,
                    gameroom.gameMode,
                    gameroom.difficulty,
                    gameroom.users,
                    gameroom.isInGame,
                );
                this._gameRooms.set(gameroom.gameroomName, newGameroom);
            });
        });
    }

    resetGamerooms(): void {
        this._currentGameroom = undefined;
        this.gameManager.colorManager.gameroomName = undefined;
        this._gameRooms = new Map<string, Gameroom>();
    }

    createGameroomEvent(gameroomName: string, gameMode: GameMode, difficulty: Difficulty): void {
        this.gameroomCommunications.createNewGameroom(gameroomName, gameMode, difficulty);
    }

    addGameroom(newNetworkGameroom: INetworkGameroom): void {
        const newGameroom = new Gameroom(
            this.gameroomCommunications,
            this.constants,
            newNetworkGameroom.gameroomName,
            newNetworkGameroom.gameMode,
            newNetworkGameroom.difficulty,
            newNetworkGameroom.users,
            newNetworkGameroom.isInGame,
        );
        this._gameRooms.set(newGameroom.name, newGameroom);
        if (newNetworkGameroom.users.includes(this.profileManager.userProfile.username)) {
            this._currentGameroom = newGameroom;
            this.gameManager.colorManager.gameroomName = newGameroom.name;
        }
    }

    deleteGameroom(gameroomToDelete: INetworkGameroomDelete): void {
        const gameroom: Gameroom = this._gameRooms.get(gameroomToDelete.gameroomName);
        if (gameroom.users.has(this.profileManager.userProfile.username)) {
            this._currentGameroom = undefined;
            this.gameManager.colorManager.gameroomName = undefined;
        }
        this._gameRooms.delete(gameroomToDelete.gameroomName);
    }

    addUserToGameroom(gameroomEdit: INetworkGameroomEdit): void {
        if (this._gameRooms.has(gameroomEdit.gameroomName)) {
            this._gameRooms.get(gameroomEdit.gameroomName).addUser(gameroomEdit.username);
            if (gameroomEdit.username === this.profileManager.userProfile.username) {
                this._currentGameroom = this._gameRooms.get(gameroomEdit.gameroomName);
                this.gameManager.colorManager.gameroomName = gameroomEdit.gameroomName;
            }
        }
    }

    removeUserFromGameroom(gameroomEdit: INetworkGameroomEdit): void {
        if (this._gameRooms.has(gameroomEdit.gameroomName)) {
            this._gameRooms.get(gameroomEdit.gameroomName).removeUser(gameroomEdit.username);
            if (gameroomEdit.username === this.profileManager.userProfile.username) {
                this._currentGameroom = undefined;
                this.gameManager.colorManager.gameroomName = undefined;
            }
        }
    }

    startGame(startGame: INetworkStartGame): void {
        if (this._gameRooms.has(startGame.gameroomName)) {
            this._gameRooms.get(startGame.gameroomName).startGame();
            if (this.currentGameroom && this.currentGameroom.name === startGame.gameroomName) {
                this.gameManager.startNewGame(this.currentGameroom);
            }
        }
    }

    endGame(endGame: INetworkEndGame): void {
        if (this._gameRooms.has(endGame.gameroomName)) {
            this._gameRooms.get(endGame.gameroomName).endGame();
            if (this.currentGameroom && this.currentGameroom.name === endGame.gameroomName) {
                this.gameManager.endGame();
            }
        }
    }
}
