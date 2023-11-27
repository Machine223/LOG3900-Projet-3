import _ from 'lodash';
import Container from 'typedi';
import { SOCKET } from '../constants';
import { IChannelMetadata } from '../interfaces/IChannelMetadata';
import { IMessage } from '../interfaces/IMessage';
import { ChatCommunications } from '../services/communications/chatCommunications.service';
import { DbCommunications } from '../services/communications/dbCommunications.service';

export class Channel {
    chatCommunications: ChatCommunications;
    dbCommunications: DbCommunications;
    channelMetadata: IChannelMetadata;

    constructor(channelMetadata: IChannelMetadata) {
        this.chatCommunications = Container.get(ChatCommunications);
        this.dbCommunications = Container.get(DbCommunications);
        this.channelMetadata = channelMetadata;
    }

    dispatchMessage(messageObject: IMessage) {
        messageObject.timestamp = Date.now();
        this.dbCommunications.saveMessage(messageObject);

        const users = _.get(this.channelMetadata, 'users', []);
        users.forEach((username: string) => {
            this.chatCommunications.dispatchToOne(SOCKET.CHAT_MESSAGE_NEW, username, messageObject);
        });
    }

    init() {
        this.dbCommunications.saveChannel(this.channelMetadata);
        this.chatCommunications.dispatchToAll(SOCKET.CHANNEL_NEW, this.channelMetadata);
    }
    destory() {
        this.dbCommunications.removeChannel(this.channelMetadata.channelName);
        this.dbCommunications.removeMessageFromChannel(this.channelMetadata.channelName);
        this.chatCommunications.dispatchToAll(SOCKET.CHANNEL_DELETE, { channelName: this.channelMetadata.channelName });
    }

    addUser(usernameToAdd: string) {
        const users = this.channelMetadata.users;
        if (!users.includes(usernameToAdd)) {
            this.dbCommunications.addUserToChannel(usernameToAdd, this.channelMetadata.channelName);
            users.push(usernameToAdd);
            this.chatCommunications.dispatchToAll(SOCKET.CHANNEL_ADD_USER, {
                username: usernameToAdd,
                channelName: this.channelMetadata.channelName,
            });
        }
    }
    removeUser(usernameToRemove: string) {
        this.dbCommunications.removeUserFromChannel(usernameToRemove, this.channelMetadata.channelName);

        const users = this.channelMetadata.users;
        const index = users.indexOf(usernameToRemove);
        users.splice(index, 1);
        this.chatCommunications.dispatchToAll(SOCKET.CHANNEL_REMOVE_USER, {
            username: usernameToRemove,
            channelName: this.channelMetadata.channelName,
        });
    }
}
