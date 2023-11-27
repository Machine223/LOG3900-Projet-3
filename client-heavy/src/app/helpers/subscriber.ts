import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
/* tslint:disable */
@Component({
    template: '',
})
export class Subscriber implements OnDestroy {
    subscriptions: Subscription[];
    constructor() {
        this.subscriptions = [];
    }

    ngOnDestroy(): void {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
        this.subscriptions = [];
    }
}
