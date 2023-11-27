import { Component, NgZone, OnInit } from '@angular/core';
import { IpcRendererEvent } from 'electron';
import { ElectronService } from 'ngx-electron';
import { filter, take } from 'rxjs/operators';
import { SoundPlayerService } from 'src/app/game/sound-player.service';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { Theme } from 'src/app/profile/profile-account/theme';
import { ThemeService } from 'src/app/profile/theme.service';
import { Subscriber } from '../../helpers/subscriber';
import { ProfileManagerService } from '../../profile/profile-manager.service';
import { ChannelManagerService } from '../channel-manager.service';
import { SocketService } from '../socket.service';
import { ZoomService } from '../zoom.service';
import { IWindowChannelInformation } from './window-channel-Information';

@Component({
    selector: 'app-windowed-chat',
    templateUrl: './windowed-chat.component.html',
    styleUrls: ['./windowed-chat.component.scss'],
})
export class WindowedChatComponent extends Subscriber implements OnInit {
    private channelInformation: IWindowChannelInformation;
    constructor(
        public channelManager: ChannelManagerService,
        private socketService: SocketService,
        private electronService: ElectronService,
        private profileManager: ProfileManagerService,
        private constants: ConstantsRepositoryService,
        private zone: NgZone,
        private soundPlayer: SoundPlayerService,
        private themeService: ThemeService,
        private zoomService: ZoomService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.soundPlayer.mute();
        this.subscriptions.push(
            this.channelManager.onChannelsFetched.subscribe(() => {
                this.channelManager.updateWindowChannels(this.channelInformation);
                this.electronService.remote.getCurrentWindow().show();
            }),
            this.channelManager.onChannelSelect.subscribe(() => {
                const channelName = this.channelManager.currentlySelectedChannel
                    ? this.channelManager.currentlySelectedChannel.name
                    : undefined;
                this.electronService.ipcRenderer.send(this.constants.CURRENTLY_SELECTED_CHANNEL, channelName);
            }),
        );
        this.addListeners();
    }

    private addListeners(): void {
        this.electronService.ipcRenderer.once(this.constants.USERNAME, (event: IpcRendererEvent, username: string) => {
            this.zone.run(() => {
                if (!this.socketService.isConnected) {
                    this.profileManager.getUserProfileAndConnectWindow(username);
                }
            });
        });
        this.electronService.ipcRenderer.once(
            this.constants.CHANNEL_INFORMATION,
            (event: IpcRendererEvent, channelInformation: IWindowChannelInformation) => {
                this.zone.run(() => {
                    this.channelInformation = channelInformation;

                    this.socketService.isConnectedObservable
                        .pipe(filter((isConnected: boolean) => isConnected === true))
                        .pipe(take(1))
                        .subscribe(() => {
                            this.zoomService.connect(channelInformation.connectedZoomChannel);
                        });
                });
            },
        );
        this.electronService.ipcRenderer.on(this.constants.THEME, (event: IpcRendererEvent, theme: Theme) => {
            this.zone.run(() => {
                this.themeService.theme = theme;
            });
        });
        this.electronService.remote.getCurrentWindow().on('close', () => {
            this.zone.run(() =>
                this.electronService.ipcRenderer.send(
                    this.constants.CHANNEL_INFORMATION,
                    this.channelManager.getWindowChannelInformation(),
                ),
            );
        });
    }
}
