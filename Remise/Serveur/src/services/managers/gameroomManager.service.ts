import _ from 'lodash';
import { Service } from 'typedi';
import { Gameroom } from '../../classes/Gameroom';
import { VIRTUAL_PLAYER_NAMES } from '../../constants';
import { IChannelMetadata } from '../../interfaces/IChannelMetadata';
import { IGameroomMetadata } from '../../interfaces/IGameroomMetadata';
import { ChannelManager } from './channelManager.service';

@Service()
export class GameroomManager {
    gamerooms: Map<string, Gameroom> = new Map();
    constructor(private channelManager: ChannelManager) {}

    getGameroomMetadatas(): IGameroomMetadata[] {
        const gameroomMetadatas: IGameroomMetadata[] = [];
        this.gamerooms.forEach((gameroom: Gameroom) => {
            gameroomMetadatas.push(gameroom.gameroomMetadata);
        });
        return gameroomMetadatas;
    }

    createGameroom(gameroomMetadata: IGameroomMetadata) {
        const gameroom = new Gameroom(gameroomMetadata);
        gameroom.init();
        this.gamerooms.set(gameroomMetadata.gameroomName, gameroom);

        const privateChannelMetadata: IChannelMetadata = {
            channelName: `${gameroomMetadata.gameroomName}'s private channel`,
            users: Array.from(gameroomMetadata.users),
            isGameChannel: true,
        };
        this.channelManager.createChannel(privateChannelMetadata);
    }
    removeGameroom(gameroomName: string) {
        const gameroom = this.gamerooms.get(gameroomName);
        if (gameroom) {
            gameroom.destory();
            this.gamerooms.delete(gameroomName);
        }
    }

    addUserToGameroom(username: string, gameroomName: string) {
        const gameroom = this.gamerooms.get(gameroomName);
        if (gameroom) {
            this.channelManager.addUserToChannel(username, `${gameroomName}'s private channel`);
            gameroom.addUser(username);
        }
    }
    removeUserFromGameroom(username: string, gameroomName: string) {
        const gameroom = this.gamerooms.get(gameroomName);
        if (gameroom) {
            this.channelManager.removeUserFromChannel(username, `${gameroomName}'s private channel`);
            gameroom.removeUser(username);
            for (const player of gameroom.gameroomMetadata.users) {
                if (!VIRTUAL_PLAYER_NAMES.has(player)) {
                    // has a human player
                    return;
                }
            }
            // no human player left
            this.removeGameroom(gameroomName);
            this.channelManager.removeChannel(`${gameroomName}'s private channel`);
        }
    }
    removeUserFromAllGameroom(username: string) {
        this.gamerooms.forEach((gameroom: Gameroom, gameroomName: string) => {
            if (gameroom.gameroomMetadata.users.includes(username)) {
                this.removeUserFromGameroom(username, gameroomName);
            }
        });
    }

    startGame(gameroomName: string) {
        const gameroom = this.gamerooms.get(gameroomName);
        if (gameroom) {
            gameroom.gameroomMetadata.isInGame = true;
            gameroom.startGame(gameroom.gameroomMetadata);
        }
    }
}
