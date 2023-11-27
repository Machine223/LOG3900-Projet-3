import { Injectable } from '@angular/core';
import { Sound } from './sound';

@Injectable({
    providedIn: 'root',
})
export class SoundPlayerService {
    private notification: HTMLAudioElement;
    private music: HTMLAudioElement;

    get isMuted(): boolean {
        return this.notification.muted && this.music.muted;
    }

    constructor() {
        this.notification = new Audio();
        this.music = new Audio();
        this.music.src = Sound.Background;
        this.music.loop = true;
        this.music.load();
    }

    playNotification(source: string): void {
        this.notification.src = source;
        this.notification.loop = false;
        this.notification.load();
        this.notification.play();
    }

    playMusic(): void {
        this.music.play();
    }

    stopMusic(): void {
        this.music.pause();
        this.music.currentTime = 0;
    }

    mute(): void {
        this.notification.muted = true;
        this.music.muted = true;
    }

    unmute(): void {
        this.notification.muted = false;
        this.music.muted = false;
    }

    toggleMute(): void {
        if (this.isMuted) {
            this.unmute();
        } else {
            this.mute();
        }
    }
}
