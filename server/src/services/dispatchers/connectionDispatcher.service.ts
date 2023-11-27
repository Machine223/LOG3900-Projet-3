import _ from 'lodash';
import SocketIO from 'socket.io';
import { Service } from 'typedi';
import { SOCKET } from '../../constants';
import { DisconnectionManager } from '../managers/disconnectionManager.service';
import { SessionManager } from '../managers/sessionManager.service';
import { SocketService } from '../socket.service';

@Service()
export class ConnectionDispatcher {
    constructor(
        private socketService: SocketService,
        private sessionManager: SessionManager,
        private disconnectionManager: DisconnectionManager,
    ) {
        this.socketService.io.on(SOCKET.CONNECTION, (socket: SocketIO.Socket) => {
            const username = _.get(socket, 'handshake.query.username');
            this.sessionManager.add(socket.id, username);
            console.log(`🔗  ${username} : ${socket.id} has just connected!`);

            socket.on(SOCKET.DISCONNECT, () => {
                this.sessionManager.removeOne(username, socket.id);
                if (!this.sessionManager.has(username)) {
                    this.disconnectionManager.disconnect(username);
                    console.log(`🔗  ${username} has just disconnected!`);
                }

                socket.broadcast.emit(SOCKET.ZOOM_USER_DISCONNECTED, username);
            });

            socket.on(SOCKET.ZOOM_JOIN_ROOM, (dataString: string) => {
                const { username, roomId } = JSON.parse(dataString);
                socket.leave(roomId);
                socket.join(roomId);
                socket.to(roomId).broadcast.emit(SOCKET.ZOOM_USER_CONNECTED, username);
                console.log(`🎤  ${username} started talking in ${roomId}!`);
            });
            socket.on(SOCKET.ZOOM_USER_DISCONNECTED, (dataString: string) => {
                const { username, roomId } = JSON.parse(dataString);
                socket.to(roomId).broadcast.emit(SOCKET.ZOOM_USER_DISCONNECTED, username);
                socket.leave(roomId);
                console.log(`🎤  ${username} stopped talking in ${roomId}!`);
            });
        });
    }
}
