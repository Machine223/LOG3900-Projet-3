import { GameMode } from 'src/app/profile/user-profile/history/game-information/game-mode';
import { Difficulty } from 'src/app/word-image-pair/enums/difficulty';

export interface INetworkGameroom {
    gameroomName: string;
    gameMode: GameMode;
    difficulty: Difficulty;
    users: string[];
    isInGame: boolean;
}
