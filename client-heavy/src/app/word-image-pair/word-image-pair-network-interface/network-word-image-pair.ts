import { Difficulty } from '../enums/difficulty';
import { INetworkDrawing } from './network-drawing';

export interface INetworkWordImagePair {
    word: string;
    hints: string[];
    difficulty: Difficulty;
    delay: number;
    isRandom: boolean;
    drawing: INetworkDrawing;
}
