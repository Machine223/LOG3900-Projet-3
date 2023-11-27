import { Component, OnInit } from '@angular/core';
import { Subscriber } from 'src/app/helpers/subscriber';
import { ProfileManagerService } from '../profile-manager.service';
import { IGameInformation } from '../user-profile/history/game-information/game-information';
import { ISession } from '../user-profile/history/session/session';
import { HistoryItem } from './history-item';

@Component({
    selector: 'app-profile-history',
    templateUrl: './profile-history.component.html',
    styleUrls: ['./profile-history.component.scss'],
})
export class ProfileHistoryComponent extends Subscriber implements OnInit {
    historyItems: HistoryItem[];
    isGeneratingHistory: boolean;

    get isUpdating(): boolean {
        return this.profileManager.isUpdatingStatsHistory;
    }

    constructor(private profileManager: ProfileManagerService) {
        super();
        this.historyItems = [];
        this.isGeneratingHistory = false;
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this.profileManager.updatingStatHistory.subscribe((isUpdating: boolean) => {
                if (!isUpdating) {
                    this.generateHistoryItems();
                }
            }),
        );
    }

    generateHistoryItems(): void {
        this.isGeneratingHistory = true;
        this.profileManager.userProfile.history.games.forEach((gameInformation: IGameInformation) => {
            const historyItem: HistoryItem = new HistoryItem();
            historyItem.setFromGameInformation(gameInformation);
            this.historyItems.push(historyItem);
        });
        const allDates: Set<number> = new Set<number>();
        this.profileManager.userProfile.history.sessions.forEach((session: ISession) => {
            const historyItem: HistoryItem = new HistoryItem();
            historyItem.setFromSession(session);
            this.historyItems.push(historyItem);

            const dateTimestamp: number = this.clearBelowDay(session.timestamp);
            if (!allDates.has(dateTimestamp)) {
                allDates.add(dateTimestamp);
                const historyItemDate: HistoryItem = new HistoryItem();
                historyItemDate.setFromDate(dateTimestamp);
                this.historyItems.push(historyItemDate);
            }
        });
        this.historyItems.sort((a: HistoryItem, b: HistoryItem) => b.timestamp - a.timestamp);
        this.isGeneratingHistory = false;
    }

    private clearBelowDay(timestamp: number): number {
        const date: Date = new Date(timestamp);
        date.setHours(23, 59, 59, 999);
        return date.getTime();
    }
}
