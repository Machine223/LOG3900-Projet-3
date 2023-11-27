import { Server } from 'http';
import _ from 'lodash';
import { Document } from 'mongoose';
import SocketIO from 'socket.io';
import { Container, Service } from 'typedi';
import { IMessage } from '../interfaces/IMessage';
import { AuthService } from './auth.service';

@Service()
export class SocketService {
    io: SocketIO.Server = {} as SocketIO.Server;

    constructor(private authService: AuthService) {}

    init(server: Server) {
        this.io = SocketIO.listen(server);

        this.io.on('connection', (socket: SocketIO.Socket) => {
            console.log(`🧀  ${_.get(socket, 'handshake.query.username')} from ${socket.id} has just connected!`);
            this.authService.addSession(socket.id, _.get(socket, 'handshake.query.username'));

            socket.on('chat message', (messageString: string) => {
                const messageModel = Container.get('messageModel') as Models.MessageModel;
                const messageObject = JSON.parse(messageString) as IMessage;
                messageObject.timestamp = Date.now();
                const message = new messageModel(messageObject);
                message.save((e: Error) => {
                    if (e) console.error(e);
                });
                console.log(`🗣  ${messageObject.author} : ${messageObject.content}`);
                this.io.emit('chat message', JSON.stringify(messageObject));
            });

            socket.on('disconnect', () => {
                this.authService.removeSession(_.get(socket, 'handshake.query.username'));
                console.log(`🍼  ${_.get(socket, 'handshake.query.username')} from ${socket.id} has left the chat.`);
            });
        });
    }

    async getChatHistory(): Promise<Document[]> {
        // const messageModel = Container.get('messageModel') as Models.MessageModel;
        // return await messageModel.find({});
        return [];
    }
}
