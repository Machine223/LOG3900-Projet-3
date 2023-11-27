import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-profile-history-date',
    templateUrl: './profile-history-date.component.html',
    styleUrls: ['./profile-history-date.component.scss'],
})
export class ProfileHistoryDateComponent {
    @Input() dateTimestamp: number;

    get formattedDate(): string {
        const date: Date = new Date(this.dateTimestamp);
        return date.toDateString();
    }

    constructor() {}
}
