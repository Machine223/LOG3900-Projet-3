import { Injectable, NgZone } from '@angular/core';
import { BrowserWindow, Event } from 'electron';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConstantsRepositoryService } from '../helpers/constants-repository.service';
import { Theme } from '../profile/profile-account/theme';
import { ProfileManagerService } from '../profile/profile-manager.service';
import { ThemeService } from '../profile/theme.service';
import { ChannelManagerService } from './channel-manager.service';
import { IWindowChannelInformation } from './windowed-chat/window-channel-Information';
import { ZoomService } from './zoom.service';

@Injectable({
    providedIn: 'root',
})
export class ChatWindowService {
    isDetachedSubject: BehaviorSubject<boolean>;
    isDetachedObservable: Observable<boolean>;

    CHAT_ROUTE = '/chat';
    window: BrowserWindow | null;
    isDevelopmentMode: boolean;

    get isDetached(): boolean {
        return this.isDetachedSubject.value;
    }

    constructor(
        private electronService: ElectronService,
        private profileManager: ProfileManagerService,
        private channelManager: ChannelManagerService,
        private constants: ConstantsRepositoryService,
        private zone: NgZone,
        private themeService: ThemeService,
        private zoomService: ZoomService,
    ) {
        this.window = null;
        this.isDetachedSubject = new BehaviorSubject<boolean>(false);
        this.isDetachedObservable = this.isDetachedSubject.asObservable();

        if (this.electronService.isWindows) {
            const args = this.electronService.process.argv.slice(1);
            this.isDevelopmentMode = args.some((val) => val === '--serve');
        } else {
            this.isDevelopmentMode = true;
        }

        this.themeService.themeObservable.subscribe((theme: Theme) => {
            this.sendTheme(theme);
        });
    }

    detachChatWindow(): void {
        this.createWindow();
        this.isDetachedSubject.next(true);
    }

    closeChatWindow(): void {
        if (this.isDetached) {
            this.window.close();
        }
    }

    private createWindow(): void {
        const display = this.electronService.screen.getPrimaryDisplay();
        const WIDTH = 350;
        const HEIGHT = 700;
        const OFFSET = 10;

        const rightX = display.bounds.width - WIDTH;
        const bottomY = WIDTH - OFFSET;

        this.window = new this.electronService.remote.BrowserWindow({
            x: rightX,
            y: bottomY,
            width: WIDTH,
            height: HEIGHT,
            webPreferences: {
                nodeIntegration: true,
                allowRunningInsecureContent: this.isDevelopmentMode ? true : false,
                enableRemoteModule: true,
                webSecurity: false,
            },
            show: false,
        });

        this.window.setMenuBarVisibility(false);

        this.addListeners();

        if (this.isDevelopmentMode) {
            const URL = `http://localhost:4200/#/${this.CHAT_ROUTE}`;
            this.window.loadURL(URL);
        } else {
            const loadOptions = {
                hash: this.CHAT_ROUTE,
            };
            this.window.loadFile('./dist/index.html', loadOptions);
        }

        this.onCloseWindows();
    }

    private addListeners(): void {
        this.window.webContents.on('did-finish-load', () => {
            const username = this.profileManager.userProfile.username;
            this.zone.run(() => this.window.webContents.send(this.constants.USERNAME, username));

            this.zone.run(() =>
                this.window.webContents.send(this.constants.CHANNEL_INFORMATION, this.channelManager.getWindowChannelInformation()),
            );
        });

        this.window.webContents.on('ipc-message', (event: Event, channel: string, data: any) => {
            switch (channel) {
                case this.constants.CHANNEL_INFORMATION:
                    const channelInformation = data as IWindowChannelInformation;
                    this.zone.run(() => {
                        this.channelManager.updateWindowChannels(channelInformation);
                        this.zoomService.connect(channelInformation.connectedZoomChannel);
                    });
                    break;
                case this.constants.CURRENTLY_SELECTED_CHANNEL:
                    const currentlySelectedChannel = data as string;
                    this.zone.run(() => this.channelManager.updateCurrentlySelectedChannel(currentlySelectedChannel));
                    break;
                default:
                    break;
            }
        });
    }

    private sendTheme(theme: Theme): void {
        if (this.window && this.isDetached) {
            this.zone.run(() => this.window.webContents.send(this.constants.THEME, theme));
        }
    }

    private onCloseWindows(): void {
        this.window.on('closed', () => {
            this.zone.run(() => {
                this.isDetachedSubject.next(false);
                this.window = null;
            });
        });
    }
}
