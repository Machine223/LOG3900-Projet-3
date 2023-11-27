import _ from 'lodash';
import { Service } from 'typedi';
import { GameroomManager } from './gameroomManager.service';

@Service()
export class DisconnectionManager {
    constructor(private gameroomManager: GameroomManager) {}

    disconnect(username: string) {
        this.gameroomManager.removeUserFromAllGameroom(username);
    }
}
