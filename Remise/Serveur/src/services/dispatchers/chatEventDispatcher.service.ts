import _ from 'lodash';
import SocketIO from 'socket.io';
import { Service } from 'typedi';
import { SOCKET } from '../../constants';
import { IChannelMetadata } from '../../interfaces/IChannelMetadata';
import { IMessage } from '../../interfaces/IMessage';
import { ChannelManager } from '../managers/channelManager.service';
import { SocketService } from '../socket.service';

@Service()
export class ChatEventDispatcher {
    constructor(private socketService: SocketService, private channelManager: ChannelManager) {
        this.socketService.io.on(SOCKET.CONNECTION, (socket: SocketIO.Socket) => {
            // message
            socket.on(SOCKET.CHAT_MESSAGE_NEW, (messageString: string) => {
                const messageObject = JSON.parse(messageString) as IMessage;
                this.channelManager.dispatchMessage(messageObject);
                console.log(`👄  ${messageObject.username} said "${messageObject.content}" in ${messageObject.channelName}`);
            });

            // channel
            socket.on(SOCKET.CHANNEL_ADD_USER, (dataString: string) => {
                const { channelName, username } = JSON.parse(dataString);
                this.channelManager.addUserToChannel(username, channelName);
                console.log(`🏠  ${username} joined the channel "${channelName}"`);
            });
            socket.on(SOCKET.CHANNEL_REMOVE_USER, (dataString: string) => {
                const { channelName, username } = JSON.parse(dataString);
                this.channelManager.removeUserFromChannel(username, channelName);
                console.log(`🏠  ${username} left the channel "${channelName}"`);
            });
            socket.on(SOCKET.CHANNEL_NEW, (dataString: string) => {
                const username = _.get(socket, 'handshake.query.username');
                const channelMetadata = JSON.parse(dataString) as IChannelMetadata;
                channelMetadata.isGameChannel = false;
                this.channelManager.createChannel(channelMetadata);
                console.log(`🏠  ${username} just created a new channel called "${channelMetadata.channelName}"`);
            });
            socket.on(SOCKET.CHANNEL_DELETE, (channelNameString: string) => {
                const username = _.get(socket, 'handshake.query.username');
                const { channelName } = JSON.parse(channelNameString) as { channelName: string };
                this.channelManager.removeChannel(channelName);
                console.log(`🏠  ${username} just destroyed the channel "${channelName}"`);
            });
        });
    }
}
