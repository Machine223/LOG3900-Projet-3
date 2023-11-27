import { INetworkStrokeAttributes } from 'src/app/drawing/drawers/stroke/network-data/network-stroke-attributes';
import { INetworkStrokeCoordinates } from 'src/app/drawing/drawers/stroke/network-data/network-stroke-coordinates';

export interface INetworkDrawing {
    background: string;
    backgroundOpacity: number;
    elements: INetworkStrokeAttributes[];
    coordinates: INetworkStrokeCoordinates[];
}
