import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SocketService } from '../chat/socket.service';
import { ConstantsRepositoryService } from '../helpers/constants-repository.service';
import { ProfileManagerService } from '../profile/profile-manager.service';
import { GameMode } from '../profile/user-profile/history/game-information/game-mode';
import { TutorialService } from '../tutorial/tutorial.service';
import { Difficulty } from '../word-image-pair/enums/difficulty';
import { INetworkGameroom } from './gameroom-network-interface/network-gameroom';
import { INetworkGameroomEdit } from './gameroom-network-interface/network-gameroom-edit';
import { INetworkGameroomList } from './gameroom-network-interface/network-gameroom-list';
import { INetworkStartGame } from './gameroom-network-interface/network-gameroom-start';

@Injectable({
    providedIn: 'root',
})
export class GameroomCommunicationsService {
    constructor(
        private socketService: SocketService,
        private http: HttpClient,
        private constants: ConstantsRepositoryService,
        private profileManager: ProfileManagerService,
        private tutorial: TutorialService,
    ) {}

    getAllGamerooms(callback: (gameroomList: INetworkGameroom[]) => void): void {
        if (this.tutorial.isTutorial) {
            callback(this.tutorial.getAllGamerooms());
        } else {
            this.http.get(`${this.constants.URI}/gamerooms`).subscribe((gameroomList: INetworkGameroomList) => {
                callback(gameroomList.gamerooms);
            });
        }
    }

    createNewGameroom(gameroomName: string, gameMode: GameMode, difficulty: Difficulty): void {
        const newGameroom: INetworkGameroom = {
            gameroomName,
            gameMode,
            difficulty,
            users: [this.profileManager.userProfile.username],
            isInGame: false,
        };
        if (this.tutorial.isTutorial) {
            this.tutorial.addGameroom(newGameroom);
        } else {
            this.socketService.emit(this.constants.GAMEROOM_NEW, JSON.stringify(newGameroom));
        }
    }

    joinGameroom(gameroomName: string): void {
        const editGameroom: INetworkGameroomEdit = {
            gameroomName,
            username: this.profileManager.userProfile.username,
        };
        this.socketService.emit(this.constants.GAMEROOM_ADD_USER, JSON.stringify(editGameroom));
    }

    leaveGameroom(gameroomName: string): void {
        const editGameroom: INetworkGameroomEdit = {
            gameroomName,
            username: this.profileManager.userProfile.username,
        };
        this.socketService.emit(this.constants.GAMEROOM_REMOVE_USER, JSON.stringify(editGameroom));
    }

    addVirtualPlayer(gameroomName: string, virtualPlayer: string): void {
        const editGameroom: INetworkGameroomEdit = {
            gameroomName,
            username: virtualPlayer,
        };
        if (this.tutorial.isTutorial) {
            this.tutorial.addVirtualPlayer(editGameroom);
        } else {
            this.socketService.emit(this.constants.GAMEROOM_ADD_USER, JSON.stringify(editGameroom));
        }
    }

    removeVirtualPlayer(gameroomName: string, virtualPlayer: string): void {
        const editGameroom: INetworkGameroomEdit = {
            gameroomName,
            username: virtualPlayer,
        };
        if (!this.tutorial.isTutorial) {
            this.socketService.emit(this.constants.GAMEROOM_REMOVE_USER, JSON.stringify(editGameroom));
        }
    }

    startGame(gameroomName: string): void {
        const gameroomStart: INetworkStartGame = {
            gameroomName,
        };
        if (this.tutorial.isTutorial) {
            this.tutorial.startGame(gameroomStart);
        } else {
            this.socketService.emit(this.constants.GAME_START, JSON.stringify(gameroomStart));
        }
    }
}
