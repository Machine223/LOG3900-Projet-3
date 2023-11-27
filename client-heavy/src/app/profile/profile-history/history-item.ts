import { IGameInformation } from '../user-profile/history/game-information/game-information';
import { ISession } from '../user-profile/history/session/session';
import { HistoryItemType } from './history-item-type';

export class HistoryItem {
    session: ISession;
    gameInformation: IGameInformation;
    dateTimestamp: number;
    itemType: HistoryItemType;

    get timestamp(): number {
        switch (this.itemType) {
            case HistoryItemType.Session:
                return this.session.timestamp;

            case HistoryItemType.GameInformation:
                return this.gameInformation.startTime;

            case HistoryItemType.Date:
                return this.dateTimestamp;
        }
    }

    setFromSession(session: ISession): void {
        this.session = session;
        this.itemType = HistoryItemType.Session;
    }

    setFromGameInformation(gameInformation: IGameInformation): void {
        this.gameInformation = gameInformation;
        this.itemType = HistoryItemType.GameInformation;
    }

    setFromDate(dateTimestamp: number): void {
        this.dateTimestamp = dateTimestamp;
        this.itemType = HistoryItemType.Date;
    }
}
