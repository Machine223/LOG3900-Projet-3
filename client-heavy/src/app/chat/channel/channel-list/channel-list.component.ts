import { Component, Input, OnInit } from '@angular/core';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { Subscriber } from 'src/app/helpers/subscriber';
import { ViewOptionsService } from 'src/app/navigation/view-options.service';
import { AlertService } from 'src/app/pop-up/alert/alert.service';
import { ChannelManagerService } from '../../channel-manager.service';
import { ChatWindowService } from '../../chat-window.service';
import { Channel } from '../channel';

@Component({
    selector: 'app-channel-list',
    templateUrl: './channel-list.component.html',
    styleUrls: ['./channel-list.component.scss'],
})
export class ChannelListComponent extends Subscriber implements OnInit {
    @Input() isDetached: boolean;

    orderedChannels: Array<Channel>;
    filteredJoinedChannels: Array<Channel>;
    filteredNotJoinedChannels: Array<Channel>;
    filteredGameChannels: Array<Channel>;
    filterCriteria: string;
    newChannelName: string;

    constructor(
        private channelManagerService: ChannelManagerService,
        private alertService: AlertService,
        public viewOption: ViewOptionsService,
        private chatWindowService: ChatWindowService,
        private constants: ConstantsRepositoryService,
    ) {
        super();
        this.orderedChannels = [];
        this.filteredJoinedChannels = [];
        this.filteredNotJoinedChannels = [];
        this.filteredGameChannels = [];
        this.filterCriteria = '';
        this.newChannelName = '';
        this.subscriptions.push(
            channelManagerService.onChannelChange.subscribe(() => {
                this.updateChannels();
            }),
        );
    }

    ngOnInit(): void {
        this.updateChannels();
    }

    updateChannels(): void {
        const channels: Array<Channel> = Array.from(this.channelManagerService.channels.values());
        this.orderedChannels = channels.sort((a: Channel, b: Channel) => {
            if (a.name === this.constants.GENERAL_CHANNEL_NAME) {
                return -1;
            } else if (b.name === this.constants.GENERAL_CHANNEL_NAME) {
                return 1;
            } else {
                return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
            }
        });
        this.updateFilter();
    }

    onFilterChange(): void {
        this.updateFilter();
    }

    updateFilter(): void {
        this.filteredJoinedChannels = [];
        this.filteredNotJoinedChannels = [];
        this.filteredGameChannels = [];
        if (this.filterCriteria === '') {
            this.orderedChannels.forEach((channel: Channel) => {
                if (channel.isGameChannel) {
                    if (channel.isJoined) {
                        this.filteredGameChannels.push(channel);
                    }
                } else {
                    channel.isJoined ? this.filteredJoinedChannels.push(channel) : this.filteredNotJoinedChannels.push(channel);
                }
            });
        } else {
            this.orderedChannels.forEach((channel: Channel) => {
                if (channel.name.toLowerCase().includes(this.filterCriteria.toLowerCase())) {
                    if (channel.isGameChannel) {
                        if (channel.isJoined) {
                            this.filteredGameChannels.push(channel);
                        }
                    } else {
                        channel.isJoined ? this.filteredJoinedChannels.push(channel) : this.filteredNotJoinedChannels.push(channel);
                    }
                }
            });
        }
    }

    createChannel(): void {
        if (this.newChannelName.trim().length > 0) {
            if (this.orderedChannels.find((channel: Channel) => channel.name.toLowerCase() === this.newChannelName.toLowerCase())) {
                const title = 'Channel already exists';
                const content = 'This channel name already exists, please use another one';
                this.alertService.alertError(title, content);
            } else {
                this.channelManagerService.createChannelEvent(this.newChannelName);
                this.newChannelName = '';
            }
        } else {
            this.newChannelName = '';
        }
    }

    onSelect(channelName: string): void {
        this.channelManagerService.selectChannel(channelName);
    }

    onDetachChat(): void {
        this.chatWindowService.detachChatWindow();
    }
}
