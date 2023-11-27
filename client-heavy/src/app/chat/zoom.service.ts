import { Injectable } from '@angular/core';
import Peer, { MediaConnection } from 'peerjs';
import { ProfileManagerService } from '../profile/profile-manager.service';
import { SocketService } from './socket.service';

@Injectable({
    providedIn: 'root',
})
export class ZoomService {
    private myPeer: Peer;
    private calls: Map<string, MediaConnection> = new Map();
    private stream: MediaStream;
    users = [];
    currentChannel = '';

    get isActive(): boolean {
        return this.currentChannel !== '';
    }

    get currentUsername(): string {
        return this.profileManagerService.userProfile.username;
    }

    constructor(private socketService: SocketService, private profileManagerService: ProfileManagerService) {}

    connect(channelName: string): void {
        if (channelName === '') {
            return;
        }

        this.disconnect();
        this.start(channelName);
    }

    disconnect(): void {
        if (!this.isActive) {
            return;
        }

        this.socketService.emit('zoom_user_disconnected', JSON.stringify({ roomId: this.currentChannel, username: this.currentUsername }));

        this.users = [];
        this.currentChannel = '';
        if (this.myPeer) {
            this.myPeer.destroy();
        }
        for (const username of this.calls.keys()) {
            this.calls.get(username).close();
        }
        this.calls.clear();
        this.stopMicrophone();
    }

    private start(channelName: string): void {
        this.currentChannel = channelName;
        this.users = [this.currentUsername];
        this.startMicrophone().then((stream: MediaStream) => {
            this.stream = stream;
            this.myPeer = new Peer(this.currentUsername, {
                host: 'p3-peerjs.herokuapp.com',
                port: 443,
                secure: true,
                path: '/myapp',
            });
            this.myPeer.on('open', (username: string) => {
                this.socketService.emit('zoom_join_room', JSON.stringify({ roomId: this.currentChannel, username }));
            });
            this.myPeer.on('call', (call) => {
                this.users.push(call.peer);
                call.answer(this.stream);
                const audio: HTMLAudioElement = new Audio();
                call.on('stream', (userAudioStream) => {
                    this.playStream(audio, userAudioStream);
                });
            });
        });
    }

    onZoomUserConnection(username: string): void {
        this.users.push(username);
        const call = this.myPeer.call(username, this.stream);
        const audio: HTMLAudioElement = new Audio();
        if (call) {
            call.on('stream', (userAudioStream) => {
                this.playStream(audio, userAudioStream);
            });
            call.on('close', () => {
                audio.pause();
                audio.src = '';
                audio.remove();
                this.removeFromUsers(username);
            });
            this.calls.set(username, call);
        }
    }

    onZoomUserDisconnection(username: string): void {
        if (username === this.currentUsername) {
            return;
        }

        if (this.calls.has(username)) {
            this.calls.get(username).close();
            this.calls.delete(username);
        }
        this.removeFromUsers(username);
    }

    private playStream(audio: HTMLAudioElement, stream: MediaStream): void {
        audio.srcObject = stream;
        audio.addEventListener('loadedmetadata', () => {
            audio.play();
        });
    }

    private async startMicrophone(): Promise<MediaStream> {
        return navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
        });
    }

    private stopMicrophone(): void {
        if (this.stream) {
            this.stream.getTracks().forEach((track) => track.stop());
        }
    }

    private removeFromUsers(username: string): void {
        this.users = this.users.filter((el) => el !== username);
    }
}
