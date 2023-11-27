import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/chat/socket.service';
import { INetworkBackground } from 'src/app/drawing/drawers/color/network-background';
import { RemoteDrawerService } from 'src/app/drawing/drawers/remote-drawer.service';
import { INetworkStrokeAttributes } from 'src/app/drawing/drawers/stroke/network-data/network-stroke-attributes';
import { INetworkStrokeCoordinates } from 'src/app/drawing/drawers/stroke/network-data/network-stroke-coordinates';
import { INetworkStrokeId } from 'src/app/drawing/drawers/stroke/network-data/network-stroke-id';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { GameLocalStateService } from '../game-local-state.service';

@Injectable({
    providedIn: 'root',
})
export class StrokeEventDispatcherService {
    private socketSubcriptions: Subscription[];

    constructor(
        private socketService: SocketService,
        private remoteDrawerService: RemoteDrawerService,
        private constants: ConstantsRepositoryService,
        private gameLocalStateService: GameLocalStateService,
    ) {
        this.handleListeners();
    }

    private onStrokeAttributes(): Subscription {
        return this.socketService.listen(this.constants.DRAW_NEW_ELEMENT).subscribe((strokeAttributesString: string) => {
            const strokeAttributes = JSON.parse(strokeAttributesString) as INetworkStrokeAttributes;
            this.remoteDrawerService.setStrokeAttributes(strokeAttributes);
        });
    }

    private onStrokeCoordinates(): Subscription {
        return this.socketService.listen(this.constants.DRAW_NEW_COORDS).subscribe((strokeCoordinatesString: string) => {
            const strokeCoordinates = JSON.parse(strokeCoordinatesString) as INetworkStrokeCoordinates;
            this.remoteDrawerService.drawStroke(strokeCoordinates);
        });
    }

    private onDeleteStroke(): Subscription {
        return this.socketService.listen(this.constants.DRAW_DELETE_ELEMENT).subscribe((strokeIdString: string) => {
            const id = (JSON.parse(strokeIdString) as INetworkStrokeId).id;
            this.remoteDrawerService.deleteStroke(id);
        });
    }

    private onUnDeleteStroke(): Subscription {
        return this.socketService.listen(this.constants.DRAW_UNDELETE_ELEMENT).subscribe((strokeId: string) => {
            const id = (JSON.parse(strokeId) as INetworkStrokeId).id;
            this.remoteDrawerService.unDeleteStroke(id);
        });
    }

    private onBackgroundChangeCoordinates(): Subscription {
        return this.socketService.listen(this.constants.DRAW_EDIT_BACKGROUND).subscribe((backgroundString: string) => {
            const background = JSON.parse(backgroundString) as INetworkBackground;
            this.remoteDrawerService.changeBackgroundColor(background);
        });
    }

    private handleListeners(): void {
        this.socketSubcriptions = [];
        this.gameLocalStateService.isListening.subscribe((isListening: boolean) => {
            if (isListening && this.socketService.isConnected) {
                this.addListeners();
            } else {
                this.removeListeners();
            }
        });
        this.socketService.isConnectedObservable.subscribe((isConnected: boolean) => {
            if (!isConnected) {
                this.removeListeners();
            }
        });
    }

    private addListeners(): void {
        this.socketSubcriptions.push(this.onStrokeAttributes());
        this.socketSubcriptions.push(this.onStrokeCoordinates());
        this.socketSubcriptions.push(this.onDeleteStroke());
        this.socketSubcriptions.push(this.onUnDeleteStroke());
        this.socketSubcriptions.push(this.onBackgroundChangeCoordinates());
    }

    private removeListeners(): void {
        for (const subscription of this.socketSubcriptions) {
            subscription.unsubscribe();
        }
        this.socketSubcriptions = [];
    }
}
