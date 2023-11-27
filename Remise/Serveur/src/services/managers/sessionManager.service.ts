import bcrypt from 'bcrypt';
import _ from 'lodash';
import { Service } from 'typedi';
import { DbCommunications } from '../communications/dbCommunications.service';

@Service()
export class SessionManager {
    readonly sessions: Map<string, string[]>;

    constructor(private dbCommunications: DbCommunications) {
        this.sessions = new Map();
    }

    has(username: string): boolean {
        return this.sessions.has(username);
    }

    add(socketId: string, username: string) {
        let socketIdList: string[] = [];
        if (this.sessions.has(username)) {
            socketIdList = this.sessions.get(username) || [];
        } else {
            this.dbCommunications.addSessionHistory(username, { type: 'signIn', timestamp: Date.now() });
        }
        socketIdList.push(socketId);
        this.sessions.set(username, socketIdList);
    }

    removeOne(username: string, socketId: string) {
        console.log(`🔗  ${username} : Remove socketId ${socketId}`);
        const socketIdList = this.sessions.get(username);
        if (socketIdList) {
            const index = socketIdList.indexOf(socketId);
            if (index !== -1) {
                socketIdList.splice(index, 1);
            }

            if (socketIdList.length === 0) {
                this.removeAll(username);
            } else {
                this.sessions.set(username, socketIdList);
            }
        }
    }

    removeAll(username: string) {
        console.log(`🔗  ${username} : Remove All socketId`);
        this.sessions.delete(username);
        this.dbCommunications.addSessionHistory(username, { type: 'signOut', timestamp: Date.now() });
    }

    async signIn(username: string, password: string): Promise<number> {
        const user = await this.dbCommunications.getUser(username);
        const goodCredentials = !_.isEmpty(user) && (await bcrypt.compare(password, user.password));

        if (goodCredentials) {
            if (this.has(username)) {
                // Good credentials but user already connected
                return 400;
            } else {
                // Good credentials and user not connected
                return 200;
            }
        } else {
            // Bad credentials
            return 401;
        }
    }
}
