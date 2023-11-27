import _ from 'lodash';
import { Service } from 'typedi';
import { SessionManager } from '../managers/sessionManager.service';
import { SocketService } from '../socket.service';

@Service()
export class GameCommunications {
    constructor(private socketService: SocketService, private sessionManager: SessionManager) {}

    dispatchToOne(eventName: string, username: string, dataObject: object) {
        this.dispatchStringToOne(eventName, username, JSON.stringify(dataObject));
    }

    dispatchStringToOne(eventName: string, username: string, dataString: string) {
        const socketIdList = this.sessionManager.sessions.get(username) || [];
        for (const socketId of socketIdList) {
            this.socketService.io.to(socketId).emit(eventName, dataString);
        }
    }

    dispatchToAll(eventName: string, dataObject: object) {
        this.socketService.io.emit(eventName, JSON.stringify(dataObject));
    }
}
