import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Sound } from '../game/sound';
import { SoundPlayerService } from '../game/sound-player.service';
import { ProfileManagerService } from '../profile/profile-manager.service';
import { Channel } from './channel/channel';
import { ChatCommunicationsService } from './chat-communications.service';
import { IChatMessage } from './chat-message/chat-message';
import { INetworkChannel } from './chat-network-interface/network-channel';
import { INetworkChannelDelete } from './chat-network-interface/network-channel-delete';
import { INetworkChannelEdit } from './chat-network-interface/network-channel-edit';
import { INetworkChatMessage } from './chat-network-interface/network-chat-message';
import { IWindowChannel } from './windowed-chat/window-channel';
import { IWindowChannelInformation } from './windowed-chat/window-channel-Information';
import { ZoomService } from './zoom.service';

@Injectable({
    providedIn: 'root',
})
export class ChannelManagerService {
    private _channels: Map<string, Channel>;
    private _unreadChannels: Set<string>;
    private _currentlySelectedChannel: Channel;
    private _currentGameChannel: Channel;

    private _channelChangeSource: Subject<void>;
    private _channelsFetchedSource: Subject<void>;
    private _channelSelectSource: Subject<void>;
    onChannelChange: Observable<void>;
    onChannelsFetched: Observable<void>;
    onChannelSelect: Observable<void>;

    get channels(): Map<string, Channel> {
        return this._channels;
    }

    get currentlySelectedChannel(): Channel {
        return this._currentlySelectedChannel;
    }

    get currentGameChannel(): Channel {
        return this._currentGameChannel;
    }

    get unreadChannels(): Set<string> {
        return this._unreadChannels;
    }

    constructor(
        private chatCommunications: ChatCommunicationsService,
        private profileManager: ProfileManagerService,
        private soundPlayer: SoundPlayerService,
        private zoomService: ZoomService,
    ) {
        this._channels = new Map<string, Channel>();
        this._unreadChannels = new Set<string>();
        this._currentlySelectedChannel = undefined;
        this._channelChangeSource = new Subject();
        this.onChannelChange = this._channelChangeSource.asObservable();
        this._channelsFetchedSource = new Subject();
        this.onChannelsFetched = this._channelsFetchedSource.asObservable();
        this._channelSelectSource = new Subject();
        this.onChannelSelect = this._channelSelectSource.asObservable();
    }

    updateChannels(): void {
        this._channels = new Map<string, Channel>();
        this.chatCommunications.getAllChannels((channels: Array<INetworkChannel>) => {
            channels.forEach((channel: INetworkChannel) => {
                const loadedChannel: Channel = new Channel(
                    this.chatCommunications,
                    channel.channelName,
                    channel.isGameChannel,
                    channel.users,
                );
                if (channel.users.includes(this.profileManager.userProfile.username)) {
                    loadedChannel.joinChannel();
                }
                this._channels.set(loadedChannel.name, loadedChannel);
            });
            this._channelChangeSource.next();
            this._channelsFetchedSource.next();
        });
    }

    resetChannels(): void {
        this.unselectChannel();
        this._channels = new Map<string, Channel>();
        this._channelChangeSource.next();
        this._unreadChannels.clear();
    }

    addChannel(newChannel: INetworkChannel): void {
        const addedChannel: Channel = new Channel(
            this.chatCommunications,
            newChannel.channelName,
            newChannel.isGameChannel,
            newChannel.users,
        );
        if (newChannel.users.includes(this.profileManager.userProfile.username)) {
            addedChannel.joinChannel();
            if (addedChannel.isGameChannel) {
                this._currentGameChannel = addedChannel;
            }
        }
        this._channels.set(addedChannel.name, addedChannel);
        this._channelChangeSource.next();
    }

    deleteChannel(deletedChannelName: INetworkChannelDelete): void {
        if (this._channels.has(deletedChannelName.channelName)) {
            if (deletedChannelName.channelName === this.zoomService.currentChannel) {
                this.zoomService.disconnect();
            }

            const channelToDelete = this._channels.get(deletedChannelName.channelName);
            if (channelToDelete.isSelected) {
                this.unselectChannel();
            }
            if (channelToDelete.isGameChannel && channelToDelete.isJoined) {
                this._currentGameChannel = undefined;
            }
            this._unreadChannels.delete(deletedChannelName.channelName);
            this._channels.delete(deletedChannelName.channelName);
            this._channelChangeSource.next();
        }
    }

    newMessage(message: INetworkChatMessage): void {
        const channelName = message.channelName;
        if (this._channels.has(channelName) && this._channels.get(channelName).isJoined) {
            const channel: Channel = this._channels.get(channelName);
            if (!channel.isSelected && !channel.isGameChannel) {
                this._unreadChannels.add(channel.name);
                this.soundPlayer.playNotification(Sound.NewMessage);
            }
            const newMessage: IChatMessage = {
                author: message.username,
                content: message.content,
                timestamp: message.timestamp,
            };
            channel.addMessage(newMessage);
        }
    }

    selectChannel(channelName: string): void {
        if (this._channels.get(channelName).isJoined) {
            if (this._currentlySelectedChannel) {
                this._currentlySelectedChannel.unselectChannel();
            }
            this._unreadChannels.delete(channelName);
            this._currentlySelectedChannel = this._channels.get(channelName);
            this._currentlySelectedChannel.selectChannel();
            this._channelSelectSource.next();
        }
    }

    unselectChannel(): void {
        if (this._currentlySelectedChannel) {
            this._currentlySelectedChannel.unselectChannel();
            this._currentlySelectedChannel = undefined;
            this._channelSelectSource.next();
        }
    }

    addUser(channelEdit: INetworkChannelEdit): void {
        if (this._channels.has(channelEdit.channelName)) {
            const channel: Channel = this._channels.get(channelEdit.channelName);
            if (channelEdit.username === this.profileManager.userProfile.username) {
                channel.joinChannel();
                if (channel.isGameChannel) {
                    this._currentGameChannel = channel;
                    channel.loadChatHistory();
                }
                this._channelChangeSource.next();
            }
            channel.addUser(channelEdit.username);
        }
    }

    removeUser(channelEdit: INetworkChannelEdit): void {
        if (this._channels.has(channelEdit.channelName)) {
            const channel: Channel = this._channels.get(channelEdit.channelName);
            if (channelEdit.username === this.profileManager.userProfile.username) {
                if (channelEdit.channelName === this.zoomService.currentChannel) {
                    this.zoomService.disconnect();
                }

                if (channel.isSelected) {
                    this.unselectChannel();
                }
                if (channel.isGameChannel) {
                    this._currentGameChannel = undefined;
                }
                this._unreadChannels.delete(channel.name);
                channel.leaveChannel();
                this._channelChangeSource.next();
            }
            channel.removeUser(channelEdit.username);
        }
    }

    createChannelEvent(channelName: string): boolean {
        if (this._channels.has(channelName)) {
            return false;
        } else {
            this.chatCommunications.createNewChannel(channelName);
            return true;
        }
    }

    getWindowChannelInformation(): IWindowChannelInformation {
        const channels: IWindowChannel[] = [];
        for (const [key, value] of this._channels) {
            const windowChannel: IWindowChannel = {
                name: key,
                messages: value.messages,
                nUnreadMessages: value.nUnreadMessages,
            };
            channels.push(windowChannel);
        }
        const channelInformation: IWindowChannelInformation = {
            unreadChannels: Array.from(this._unreadChannels),
            currentlySelectedChannel: this._currentlySelectedChannel ? this._currentlySelectedChannel.name : undefined,
            channels,
            connectedZoomChannel: this.zoomService.currentChannel,
        };
        this.zoomService.disconnect();
        return channelInformation;
    }

    updateWindowChannels(channelInformation: IWindowChannelInformation): void {
        for (const channel of channelInformation.channels) {
            this._channels.get(channel.name).updateWithWindowChannel(channel);
        }

        this._unreadChannels = new Set(channelInformation.unreadChannels);

        this.updateCurrentlySelectedChannel(channelInformation.currentlySelectedChannel);
    }

    updateCurrentlySelectedChannel(channel: string): void {
        if (channel) {
            this.selectChannel(channel);
        } else {
            this.unselectChannel();
        }
    }
}
