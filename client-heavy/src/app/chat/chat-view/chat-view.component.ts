import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { Subscriber } from 'src/app/helpers/subscriber';
import { ViewOptionsService } from 'src/app/navigation/view-options.service';
import { TutorialService } from 'src/app/tutorial/tutorial.service';
import { ChannelManagerService } from '../channel-manager.service';
import { ChatWindowService } from '../chat-window.service';
import { SocketService } from '../socket.service';
import { ZoomService } from '../zoom.service';

@Component({
    selector: 'app-chat-view',
    templateUrl: './chat-view.component.html',
    styleUrls: ['./chat-view.component.scss'],
})
export class ChatViewComponent extends Subscriber implements OnInit, OnDestroy {
    currentView: string;
    isDetached: boolean;
    constructor(
        private socket: SocketService,
        public channelManager: ChannelManagerService,
        public constants: ConstantsRepositoryService,
        public viewOption: ViewOptionsService,
        private chatWindowService: ChatWindowService,
        public tutorial: TutorialService,
        private zoomService: ZoomService,
    ) {
        super();
        this.currentView = this.constants.MAIN_MENU;
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this.chatWindowService.isDetachedObservable.subscribe((isDetached: boolean) => {
                this.isDetached = isDetached;
            }),
        );
        this.subscriptions.push(
            this.tutorial.onGoodGuess.subscribe(() => {
                this.currentView = this.constants.MAIN_MENU;
            }),
        );
    }

    buttonClicked(): void {
        this.socket.connect('test');
    }

    buttonClicked2(): void {
        this.socket.disconnect();
    }

    ngOnDestroy(): void {
        this.zoomService.disconnect();
    }
}
