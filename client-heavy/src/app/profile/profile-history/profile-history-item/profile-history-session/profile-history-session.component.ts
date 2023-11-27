import { Component, Input } from '@angular/core';
import { ISession } from 'src/app/profile/user-profile/history/session/session';
import { SessionType } from 'src/app/profile/user-profile/history/session/session-type';

@Component({
    selector: 'app-profile-history-session',
    templateUrl: './profile-history-session.component.html',
    styleUrls: ['./profile-history-session.component.scss'],
})
export class ProfileHistorySessionComponent {
    @Input() session: ISession;

    get isSignIn(): boolean {
        return this.session.type === SessionType.Start;
    }

    get eventDate(): string {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        const date: Date = new Date(this.session.timestamp);
        return date.toLocaleTimeString('en-US', options);
    }
}
