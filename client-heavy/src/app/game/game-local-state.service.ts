import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GameLocalStateService {
    isListening: BehaviorSubject<boolean>;
    isEmitting: boolean;

    constructor() {
        this.isListening = new BehaviorSubject(false);
        this.isEmitting = false;
    }

    setAsEmitter(): void {
        this.isEmitting = true;
        this.isListening.next(false);
    }

    setAsListener(): void {
        this.isEmitting = false;
        this.isListening.next(true);
    }

    muteAndDeafen(): void {
        this.isListening.next(false);
        this.isEmitting = false;
    }
}
