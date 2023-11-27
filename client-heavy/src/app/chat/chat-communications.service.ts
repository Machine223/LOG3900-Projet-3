import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsRepositoryService } from '../helpers/constants-repository.service';
import { ProfileManagerService } from '../profile/profile-manager.service';
import { IChatMessage } from './chat-message/chat-message';
import { INetworkChannel } from './chat-network-interface/network-channel';
import { INetworkChannelDelete } from './chat-network-interface/network-channel-delete';
import { INetworkChannelEdit } from './chat-network-interface/network-channel-edit';
import { INetworkChannelList } from './chat-network-interface/network-channel-list';
import { INetworkChatMessage } from './chat-network-interface/network-chat-message';
import { INetworkChatMessageList } from './chat-network-interface/network-chat-message-list';
import { SocketService } from './socket.service';

@Injectable({
    providedIn: 'root',
})
export class ChatCommunicationsService {
    constructor(
        private socketService: SocketService,
        private constants: ConstantsRepositoryService,
        private profileManagerService: ProfileManagerService,
        private http: HttpClient,
    ) {}

    sendMessage(channelName: string, content: string): void {
        const socketMessage: INetworkChatMessage = {
            channelName,
            username: this.profileManagerService.userProfile.username,
            content,
            timestamp: undefined,
        };
        this.socketService.emit(this.constants.CHAT_MESSAGE_NEW_EVENT, JSON.stringify(socketMessage));
    }

    createNewChannel(channelName: string): void {
        const newChannel: INetworkChannel = {
            channelName,
            users: [this.profileManagerService.userProfile.username],
            isGameChannel: false,
        };
        this.socketService.emit(this.constants.CHANNEL_NEW_EVENT, JSON.stringify(newChannel));
    }

    joinChannel(channelName: string): void {
        const editChannel: INetworkChannelEdit = {
            channelName,
            username: this.profileManagerService.userProfile.username,
        };
        this.socketService.emit(this.constants.CHANNEL_ADD_USER, JSON.stringify(editChannel));
    }

    leaveChannel(channelName: string): void {
        const editChannel: INetworkChannelEdit = {
            channelName,
            username: this.profileManagerService.userProfile.username,
        };
        this.socketService.emit(this.constants.CHANNEL_REMOVE_USER, JSON.stringify(editChannel));
    }

    deleteChannel(channelName: string): void {
        const deleteChannel: INetworkChannelDelete = {
            channelName,
        };
        this.socketService.emit(this.constants.CHANNEL_DELETE_EVENT, JSON.stringify(deleteChannel));
    }

    getChannelHistory(channelName: string, callback: (messages: IChatMessage[]) => void): void {
        this.http.get(`${this.constants.URI}/chat/${channelName}`).subscribe((messageList: INetworkChatMessageList) => {
            const networkChatMessages: INetworkChatMessage[] = messageList.messages;
            const chatMessages: IChatMessage[] = [];
            networkChatMessages.forEach((message: INetworkChatMessage) => {
                const chatMessage: IChatMessage = {
                    author: message.username,
                    content: message.content,
                    timestamp: message.timestamp,
                };
                chatMessages.push(chatMessage);
            });
            callback(chatMessages);
        });
    }

    getAllChannels(callback: (dataString: INetworkChannel[]) => void): void {
        this.http.get(`${this.constants.URI}/channels`).subscribe((channelList: INetworkChannelList) => {
            callback(channelList.channels);
        });
    }
}
