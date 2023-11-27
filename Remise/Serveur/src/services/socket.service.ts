import { Server } from 'http';
import _ from 'lodash';
import SocketIO from 'socket.io';
import Container, { Service } from 'typedi';

@Service()
export class SocketService {
    io: SocketIO.Server = {} as SocketIO.Server;

    constructor(server = Container.get('Server') as Server) {
        this.io = SocketIO.listen(server);
    }
}
