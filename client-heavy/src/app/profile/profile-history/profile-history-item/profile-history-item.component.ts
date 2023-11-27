import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IGameInformation } from '../../user-profile/history/game-information/game-information';
import { ISession } from '../../user-profile/history/session/session';
import { HistoryItem } from '../history-item';
import { HistoryItemType } from '../history-item-type';

@Component({
    selector: 'app-profile-history-item',
    templateUrl: './profile-history-item.component.html',
    styleUrls: ['./profile-history-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHistoryItemComponent {
    @Input() historyItem: HistoryItem;

    get isSession(): boolean {
        return this.historyItem.itemType === HistoryItemType.Session;
    }

    get isGameInformation(): boolean {
        return this.historyItem.itemType === HistoryItemType.GameInformation;
    }

    get isDate(): boolean {
        return this.historyItem.itemType === HistoryItemType.Date;
    }

    get gameInformation(): IGameInformation {
        return this.historyItem.gameInformation;
    }

    get session(): ISession {
        return this.historyItem.session;
    }

    get dateTimestamp(): number {
        return this.historyItem.dateTimestamp;
    }
}
