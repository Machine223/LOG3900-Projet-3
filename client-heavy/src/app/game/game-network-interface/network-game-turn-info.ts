import { INetworkWordImagePair } from 'src/app/word-image-pair/word-image-pair-network-interface/network-word-image-pair';

export interface INetworkTurnInfo {
    drawer: string;
    virtualDrawing: INetworkWordImagePair;
}
