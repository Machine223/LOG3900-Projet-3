import { IWindowChannel } from './window-channel';

export interface IWindowChannelInformation {
    unreadChannels: string[];
    currentlySelectedChannel: string;
    channels: IWindowChannel[];
    connectedZoomChannel: string;
}
