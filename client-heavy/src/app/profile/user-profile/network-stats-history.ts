import { IHistory } from './history/history';
import { IStatistic } from './statistic/statistic';

export interface INetworkStatsHistory {
    username: string;
    history: IHistory;
    statistics: IStatistic;
}
