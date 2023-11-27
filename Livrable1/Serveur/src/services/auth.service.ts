import bcrypt from 'bcrypt';
import _ from 'lodash';
import { Container, Service } from 'typedi';
import { IUser } from '../interfaces/IUser';

@Service()
export class AuthService {
    sessions: Map<string, string>;

    constructor() {
        this.sessions = new Map();
    }

    async signIn(username: string, password: string): Promise<number> {
        const userModel = Container.get('userModel') as Models.UserModel;
        const user = (await userModel.findOne({ username })) as IUser;
        const goodCredentials = !_.isEmpty(user) && (await bcrypt.compare(password, user.password));

        if (goodCredentials) {
            if (this.sessions.has(username)) {
                // Good credentials but user already connected
                return 400;
            } else {
                // Good credentials and not user connected
                return 200;
            }
        } else {
            // Bad credentials
            return 401;
        }
    }

    async signUp(userObject: IUser) {
        const userModel = Container.get('userModel') as Models.UserModel;
        const user = new userModel(userObject);
        await user.save();
    }

    async signOut(username: string) {
        this.removeSession(username);
    }

    addSession(socketId: string, username: string) {
        this.sessions.set(username, socketId);
    }

    removeSession(username: string) {
        this.sessions.delete(username);
    }
}
