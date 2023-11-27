import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { INetworkWordGoodGuess } from '../game/game-network-interface/network-game-word-good-guess';
import { INetworkGameroom } from '../gameroom/gameroom-network-interface/network-gameroom';
import { ConstantsRepositoryService } from '../helpers/constants-repository.service';
import { TutorialService } from '../tutorial/tutorial.service';
import { ChannelManagerService } from './channel-manager.service';
import { INetworkChannel } from './chat-network-interface/network-channel';
import { INetworkChannelDelete } from './chat-network-interface/network-channel-delete';
import { INetworkChannelEdit } from './chat-network-interface/network-channel-edit';
import { INetworkChatMessage } from './chat-network-interface/network-chat-message';
import { SocketService } from './socket.service';
import { ZoomService } from './zoom.service';

@Injectable({
    providedIn: 'root',
})
export class ChatEventDispatcherService {
    private subscriptions: Subscription[];
    constructor(
        private socketService: SocketService,
        private channelManagerService: ChannelManagerService,
        private constants: ConstantsRepositoryService,
        private tutorial: TutorialService,
        private zoomService: ZoomService,
    ) {
        this.addTutorialListeners();

        this.subscriptions = [];
        socketService.isConnectedObservable.subscribe((isSocketConnected: boolean) => {
            if (isSocketConnected) {
                this.addSocketListeners();
                this.channelManagerService.updateChannels();
            } else {
                this.removeListeners();
                this.channelManagerService.resetChannels();
            }
        });
    }

    addSocketListeners(): void {
        this.subscriptions.push(
            this.socketService.listen(this.constants.CHANNEL_NEW_EVENT).subscribe((dataString: string) => {
                const newChannel: INetworkChannel = JSON.parse(dataString) as INetworkChannel;
                this.channelManagerService.addChannel(newChannel);
            }),
        );

        this.subscriptions.push(
            this.socketService.listen(this.constants.CHANNEL_ADD_USER).subscribe((dataString: string) => {
                const channelEdit: INetworkChannelEdit = JSON.parse(dataString) as INetworkChannelEdit;
                this.channelManagerService.addUser(channelEdit);
            }),
        );

        this.subscriptions.push(
            this.socketService.listen(this.constants.CHANNEL_REMOVE_USER).subscribe((dataString: string) => {
                const channelEdit: INetworkChannelEdit = JSON.parse(dataString) as INetworkChannelEdit;
                this.channelManagerService.removeUser(channelEdit);
            }),
        );

        this.subscriptions.push(
            this.socketService.listen(this.constants.CHANNEL_DELETE_EVENT).subscribe((dataString: string) => {
                const channelDelete: INetworkChannelDelete = JSON.parse(dataString) as INetworkChannelDelete;
                this.channelManagerService.deleteChannel(channelDelete);
            }),
        );

        this.subscriptions.push(
            this.socketService.listen(this.constants.CHAT_MESSAGE_NEW_EVENT).subscribe((dataString: string) => {
                const newMessage: INetworkChatMessage = JSON.parse(dataString) as INetworkChatMessage;
                this.channelManagerService.newMessage(newMessage);
            }),
        );

        this.subscriptions.push(
            this.socketService.listen(this.constants.ZOOM_USER_CONNECTED).subscribe((username: string) => {
                this.zoomService.onZoomUserConnection(username);
            }),
        );

        this.subscriptions.push(
            this.socketService.listen(this.constants.ZOOM_USER_DISCONNECTED).subscribe((username: string) => {
                this.zoomService.onZoomUserDisconnection(username);
            }),
        );
    }

    addTutorialListeners(): void {
        this.tutorial.onNewGameroom.subscribe((newGameroom: INetworkGameroom) => {
            const newChannel: INetworkChannel = {
                channelName: newGameroom.gameroomName,
                isGameChannel: true,
                users: newGameroom.users,
            };

            this.channelManagerService.addChannel(newChannel);
        });

        this.tutorial.onGoodGuess.subscribe((goodGuess: INetworkWordGoodGuess) => {
            const channelDelete: INetworkChannelDelete = {
                channelName: goodGuess.gameroomName,
            };
            this.channelManagerService.deleteChannel(channelDelete);
        });
    }

    removeListeners(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
        this.subscriptions = [];
    }
}
