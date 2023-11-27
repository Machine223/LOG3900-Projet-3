import { Observable, Subject } from 'rxjs';
import { ConstantsRepositoryService } from '../helpers/constants-repository.service';
import { GameMode } from '../profile/user-profile/history/game-information/game-mode';
import { Difficulty } from '../word-image-pair/enums/difficulty';
import { GameroomCommunicationsService } from './gameroom-communications.service';

export class Gameroom {
    readonly name: string;
    readonly gameMode: GameMode;
    readonly difficulty: Difficulty;

    /* tslint:disable*/
    private _users: Set<string>;
    private _isInGame: boolean;
    /* tslint:enable*/

    private usersChangeSource: Subject<void>;
    usersChanged: Observable<void>;

    get users(): Set<string> {
        return this._users;
    }

    get isInGame(): boolean {
        return this._isInGame;
    }

    constructor(
        private gameroomCommunications: GameroomCommunicationsService,
        private constants: ConstantsRepositoryService,
        name: string,
        gameMode: GameMode,
        difficulty: Difficulty,
        users: string[],
        isInGame: boolean,
    ) {
        this.name = name;
        this.gameMode = gameMode;
        this.difficulty = difficulty;
        this._users = new Set<string>(users);
        this._isInGame = isInGame;
        this.usersChangeSource = new Subject();
        this.usersChanged = this.usersChangeSource.asObservable();
    }

    joinGameroomEvent(): void {
        this.gameroomCommunications.joinGameroom(this.name);
    }

    addVirtualPlayerEvent(virtualPlayerName: string): void {
        this.gameroomCommunications.addVirtualPlayer(this.name, virtualPlayerName);
    }

    removeVirtualPlayerEvent(virtualPlayerName: string): void {
        this.gameroomCommunications.removeVirtualPlayer(this.name, virtualPlayerName);
    }

    quitGameroomEvent(): void {
        this.gameroomCommunications.leaveGameroom(this.name);
    }

    startGameEvent(): void {
        this.gameroomCommunications.startGame(this.name);
    }

    addUser(username: string): void {
        this.users.add(username);
        this.usersChangeSource.next();
    }

    removeUser(username: string): void {
        this.users.delete(username);
        this.usersChangeSource.next();
    }

    canStartGame(): boolean {
        let nVirtualPlayer = 0;
        let nHumanPlayer = 0;
        this._users.forEach((user: string) => {
            this.constants.VIRTUAL_PLAYER_NAMES.has(user) ? nVirtualPlayer++ : nHumanPlayer++;
        });
        switch (this.gameMode) {
            case GameMode.Melee: {
                return nHumanPlayer + nVirtualPlayer >= 3 && nHumanPlayer >= 2;
            }
            case GameMode.Solo: {
                return nVirtualPlayer === 1 && nHumanPlayer === 1;
            }
            case GameMode.Coop: {
                return nVirtualPlayer === 1 && nHumanPlayer >= 2;
            }
        }
    }

    canBeJoined(): boolean {
        return !this.isInGame && this.humanPlayerCanJoin();
    }

    canAddVirtualPlayer(): boolean {
        let nVirtualPlayer = 0;
        let nHumanPlayer = 0;
        this._users.forEach((user: string) => {
            this.constants.VIRTUAL_PLAYER_NAMES.has(user) ? nVirtualPlayer++ : nHumanPlayer++;
        });
        switch (this.gameMode) {
            case GameMode.Melee: {
                return nVirtualPlayer + nHumanPlayer < 4 && nVirtualPlayer < 2;
            }
            case GameMode.Solo: {
                return nVirtualPlayer === 0;
            }
            case GameMode.Coop: {
                return nVirtualPlayer === 0;
            }
        }
    }

    startGame(): void {
        this._isInGame = true;
    }

    endGame(): void {
        this._isInGame = false;
    }

    private humanPlayerCanJoin(): boolean {
        let nVirtualPlayer = 0;
        let nHumanPlayer = 0;
        this._users.forEach((user: string) => {
            this.constants.VIRTUAL_PLAYER_NAMES.has(user) ? nVirtualPlayer++ : nHumanPlayer++;
        });
        switch (this.gameMode) {
            case GameMode.Melee: {
                return nVirtualPlayer + nHumanPlayer < 4;
            }
            case GameMode.Solo: {
                return nHumanPlayer === 0;
            }
            case GameMode.Coop: {
                return nHumanPlayer < 4;
            }
        }
    }
}
