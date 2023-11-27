import { GameMode } from './game-mode';

export interface IGameInformation {
    gameMode: GameMode;
    scores: Map<string, number>;
    startTime: number;
    endTime: number;
}
