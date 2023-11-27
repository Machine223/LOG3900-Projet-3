import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ViewOptionsService {
    isChatSideNavOpened: boolean;
    isChatDetached: boolean;

    constructor() {
        this.isChatSideNavOpened = false;
        this.isChatDetached = false;
    }
}
