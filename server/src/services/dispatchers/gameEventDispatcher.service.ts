import _ from 'lodash';
import SocketIO from 'socket.io';
import { Service } from 'typedi';
import { SOCKET } from '../../constants';
import { IGameroomMetadata } from '../../interfaces/IGameroomMetadata';
import { GameManager } from '../managers/gameManager.service';
import { GameroomManager } from '../managers/gameroomManager.service';
import { SocketService } from '../socket.service';

@Service()
export class GameEventDispatcher {
    constructor(private socketService: SocketService, private gameManager: GameManager, private gameroomManager: GameroomManager) {
        this.socketService.io.on(SOCKET.CONNECTION, (socket: SocketIO.Socket) => {
            // draw
            socket.on(SOCKET.DRAW_NEW_ELEMENT, (dataString: string) => {
                const drawerUsername = _.get(socket, 'handshake.query.username');
                const { gameroomName } = JSON.parse(dataString);
                this.gameManager.drawNewElement(drawerUsername, gameroomName, dataString);
            });
            socket.on(SOCKET.DRAW_NEW_COORDS, (dataString: string) => {
                const drawerUsername = _.get(socket, 'handshake.query.username');
                const { gameroomName } = JSON.parse(dataString);
                this.gameManager.drawNewCoords(drawerUsername, gameroomName, dataString);
            });
            socket.on(SOCKET.DRAW_DELETE_ELEMENT, (dataString: string) => {
                const drawerUsername = _.get(socket, 'handshake.query.username');
                const { gameroomName } = JSON.parse(dataString);
                this.gameManager.drawDeleteElement(drawerUsername, gameroomName, dataString);
            });
            socket.on(SOCKET.DRAW_UNDELETE_ELEMENT, (dataString: string) => {
                const drawerUsername = _.get(socket, 'handshake.query.username');
                const { gameroomName } = JSON.parse(dataString);
                this.gameManager.drawUndeleteCoords(drawerUsername, gameroomName, dataString);
            });
            socket.on(SOCKET.DRAW_EDIT_BACKGROUND, (dataString: string) => {
                const drawerUsername = _.get(socket, 'handshake.query.username');
                const { gameroomName } = JSON.parse(dataString);
                this.gameManager.drawEditBackground(drawerUsername, gameroomName, dataString);
            });

            // gameroom
            socket.on(SOCKET.GAMEROOM_NEW, (dataString: string) => {
                const username = _.get(socket, 'handshake.query.username');
                const gameroomMetadata = JSON.parse(dataString) as IGameroomMetadata;
                gameroomMetadata.isInGame = false;
                this.gameroomManager.createGameroom(gameroomMetadata);
                console.log(`🎲  ${username} just created a gameroom "${gameroomMetadata.gameroomName}"`);
            });
            socket.on(SOCKET.GAMEROOM_ADD_USER, (dataString: string) => {
                const { gameroomName, username } = JSON.parse(dataString);
                this.gameroomManager.addUserToGameroom(username, gameroomName);
                console.log(`🎲  ${username} jointed the gameroom "${gameroomName}"`);
            });
            socket.on(SOCKET.GAMEROOM_REMOVE_USER, (dataString: string) => {
                const { gameroomName, username } = JSON.parse(dataString);
                this.gameroomManager.removeUserFromGameroom(username, gameroomName);
                console.log(`🎲  ${username} leaved the gameroom "${gameroomName}"`);
            });
            socket.on(SOCKET.GAME_START, (dataString: string) => {
                const username = _.get(socket, 'handshake.query.username');
                const { gameroomName } = JSON.parse(dataString);
                this.gameroomManager.startGame(gameroomName);
                console.log(`🎲  Game "${gameroomName}" has just started by ${username}`);
            });

            // game
            socket.on(SOCKET.WORD_CHOICE, (dataString: string) => {
                const username = _.get(socket, 'handshake.query.username');
                const { gameroomName, words } = JSON.parse(dataString);
                this.gameManager.wordChoice(gameroomName, words[0]);
                console.log(`🎲  ${username} chose the word "${words[0]}" in Game "${gameroomName}"`);
            });
            socket.on(SOCKET.HINT_ASKED, (dataString: string) => {
                const username = _.get(socket, 'handshake.query.username');
                const { gameroomName } = JSON.parse(dataString);
                this.gameManager.hintAsked(username, gameroomName);
                console.log(`🎲  ${username} asked a hint in Game "${gameroomName}"`);
            });
            socket.on(SOCKET.GOOD_GUESS, (dataString: string) => {
                const username = _.get(socket, 'handshake.query.username');
                const { gameroomName } = JSON.parse(dataString);
                this.gameManager.goodGuess(gameroomName, username);
                console.log(`🎲  ${username} guessed a word in Game "${gameroomName}"`);
            });
            socket.on(SOCKET.BAD_GUESS, (dataString: string) => {
                const username = _.get(socket, 'handshake.query.username');
                const { gameroomName, word } = JSON.parse(dataString);
                this.gameManager.badGuess(gameroomName, username, word);
                console.log(`🎲  ${username} failed a guess in Game "${gameroomName}"`);
            });
        });
    }
}
