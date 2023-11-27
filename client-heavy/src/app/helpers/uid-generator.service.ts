import { Injectable } from '@angular/core';
import { ConstantsRepositoryService } from './constants-repository.service';

@Injectable({
    providedIn: 'root',
})
export class UidGeneratorService {
    private currentUid: number;

    constructor(private constants: ConstantsRepositoryService) {
        this.currentUid = constants.INITIAL_UID;
    }

    getNewUid(): number {
        return this.currentUid++;
    }

    resetUid(): void {
        this.currentUid = this.constants.INITIAL_UID;
    }

    setUid(uid: number): void {
        this.currentUid = uid;
    }
}
