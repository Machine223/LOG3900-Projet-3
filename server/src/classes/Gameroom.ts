import _ from 'lodash';
import Container from 'typedi';
import { SOCKET } from '../constants';
import { IGameroomMetadata } from '../interfaces/IGameroomMetadata';
import { GameCommunications } from '../services/communications/gameCommunications.service';
import { GameManager } from '../services/managers/gameManager.service';

export class Gameroom {
    gameCommunications: GameCommunications;
    gameroomMetadata: IGameroomMetadata;
    gameManager: GameManager;

    constructor(gameroomMetadata: IGameroomMetadata) {
        this.gameCommunications = Container.get(GameCommunications);
        this.gameroomMetadata = gameroomMetadata;
        this.gameManager = Container.get(GameManager);
    }

    init() {
        this.gameCommunications.dispatchToAll(SOCKET.GAMEROOM_NEW, this.gameroomMetadata);
    }
    destory() {
        this.gameCommunications.dispatchToAll(SOCKET.GAMEROOM_DELETE, { gameroomName: this.gameroomMetadata.gameroomName });
    }

    addUser(usernameToAdd: string) {
        const users = this.gameroomMetadata.users;
        if (!users.includes(usernameToAdd)) {
            users.push(usernameToAdd);
            this.gameCommunications.dispatchToAll(SOCKET.GAMEROOM_ADD_USER, {
                username: usernameToAdd,
                gameroomName: this.gameroomMetadata.gameroomName,
            });
        }
    }
    removeUser(usernameToRemove: string) {
        const users = this.gameroomMetadata.users;
        const index = users.indexOf(usernameToRemove);
        if (index !== -1) {
            users.splice(index, 1);
            this.gameCommunications.dispatchToAll(SOCKET.GAMEROOM_REMOVE_USER, {
                username: usernameToRemove,
                gameroomName: this.gameroomMetadata.gameroomName,
            });
        }
    }

    startGame(gameroomMetadata: IGameroomMetadata) {
        this.gameManager.startGame(gameroomMetadata);
        this.gameroomMetadata.isInGame = true;
    }
}
