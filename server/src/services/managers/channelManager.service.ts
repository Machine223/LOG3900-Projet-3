import _ from 'lodash';
import { Service } from 'typedi';
import { Channel } from '../../classes/Channel';
import { GENERAL_CHANNEL } from '../../constants';
import { IChannelMetadata } from '../../interfaces/IChannelMetadata';
import { IMessage } from '../../interfaces/IMessage';
import { DbCommunications } from '../communications/dbCommunications.service';

@Service()
export class ChannelManager {
    channels: Map<string, Channel> = new Map();
    constructor(private dbCommunications: DbCommunications) {
        this.dbCommunications.getChannelMetadatas().then((channelMetadatas: IChannelMetadata[]) => {
            channelMetadatas.forEach((channelMetadata: IChannelMetadata) => {
                if (channelMetadata.isGameChannel) {
                    this.dbCommunications.removeChannel(channelMetadata.channelName);
                } else {
                    this.channels.set(channelMetadata.channelName, new Channel(channelMetadata));
                }
            });

            if (!this.channels.has(GENERAL_CHANNEL)) {
                this.dbCommunications.getAllUsername().then((usernames: string[]) => {
                    const generalMetadata: IChannelMetadata = {
                        channelName: GENERAL_CHANNEL,
                        users: usernames,
                        isGameChannel: false,
                    };
                    this.createChannel(generalMetadata);
                });
            }
        });
    }

    dispatchMessage(messageObject: IMessage) {
        const channelName = messageObject.channelName;
        const channel = this.channels.get(channelName);
        if (channel) {
            channel.dispatchMessage(messageObject);
        }
    }

    createChannel(channelMetadata: IChannelMetadata) {
        const channel = new Channel(channelMetadata);
        channel.init();
        this.channels.set(channelMetadata.channelName, channel);
    }
    removeChannel(channelName: string) {
        if (channelName === GENERAL_CHANNEL) return;
        const channel = this.channels.get(channelName);
        if (channel) {
            channel.destory();
            this.channels.delete(channelName);
        }
    }

    addUserToChannel(username: string, channelName: string) {
        const channel = this.channels.get(channelName);
        if (channel) {
            channel.addUser(username);
        }
    }
    removeUserFromChannel(username: string, channelName: string) {
        if (channelName === GENERAL_CHANNEL) return;
        const channel = this.channels.get(channelName);
        if (channel) {
            channel.removeUser(username);
        }
    }
}
