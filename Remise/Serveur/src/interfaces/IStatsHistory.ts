export interface IStatsHistory {
    username: string;
    history: {
        sessions: {
            type: string;
            timestamp: number;
        }[];
        games: {
            gameMode: number;
            scores: object;
            startTime: number;
            endTime: number;
        }[];
    };
    statistics: {
        totalGamePlayed: number;
        totalFFAPlayed: number;
        totalSprintPlayed: number;
        totalFFAWin: number;
        FFAWinRatio: number;
        totalGameTime: number;
        timePerGame: number;
        bestSoloScore: number;
    };
}
