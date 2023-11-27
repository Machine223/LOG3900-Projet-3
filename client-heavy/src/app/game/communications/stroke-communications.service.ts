import { Injectable } from '@angular/core';
import { SocketService } from '../../chat/socket.service';
import { INetworkBackground } from '../../drawing/drawers/color/network-background';
import { INetworkStrokeAttributes } from '../../drawing/drawers/stroke/network-data/network-stroke-attributes';
import { INetworkStrokeCoordinates } from '../../drawing/drawers/stroke/network-data/network-stroke-coordinates';
import { INetworkStrokeId } from '../../drawing/drawers/stroke/network-data/network-stroke-id';
import { ConstantsRepositoryService } from '../../helpers/constants-repository.service';

@Injectable({
    providedIn: 'root',
})
export class StrokeCommunicationsService {
    constructor(private socketService: SocketService, private constants: ConstantsRepositoryService) {}

    emitStrokeAttributes(strokeData: INetworkStrokeAttributes): void {
        this.socketService.emit(this.constants.DRAW_NEW_ELEMENT, JSON.stringify(strokeData));
    }

    emitStrokeCoordinates(coordinates: INetworkStrokeCoordinates): void {
        this.socketService.emit(this.constants.DRAW_NEW_COORDS, JSON.stringify(coordinates));
    }

    emitDeleteStroke(strokeId: INetworkStrokeId): void {
        this.socketService.emit(this.constants.DRAW_DELETE_ELEMENT, JSON.stringify(strokeId));
    }

    emitUnDeleteStroke(strokeId: INetworkStrokeId): void {
        this.socketService.emit(this.constants.DRAW_UNDELETE_ELEMENT, JSON.stringify(strokeId));
    }

    emitBackgroundChange(background: INetworkBackground): void {
        this.socketService.emit(this.constants.DRAW_EDIT_BACKGROUND, JSON.stringify(background));
    }
}
