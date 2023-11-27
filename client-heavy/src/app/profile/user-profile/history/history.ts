import { IGameInformation } from './game-information/game-information';
import { ISession } from './session/session';

export interface IHistory {
    sessions: ISession[];
    games: IGameInformation[];
}
