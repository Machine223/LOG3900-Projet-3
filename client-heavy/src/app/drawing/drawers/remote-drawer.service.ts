import { Injectable } from '@angular/core';
import { ColorManagerService } from './color/color-manager.service';
import { INetworkBackground } from './color/network-background';
import { Rgba } from './color/rgba';
import { StrokeContainerService } from './stroke-container/stroke-container.service';
import { INetworkStrokeAttributes } from './stroke/network-data/network-stroke-attributes';
import { INetworkStrokeCoordinates } from './stroke/network-data/network-stroke-coordinates';
import { Stroke } from './stroke/stroke';

@Injectable({
    providedIn: 'root',
})
export class RemoteDrawerService {
    constructor(private strokeContainer: StrokeContainerService, private colorManagerService: ColorManagerService) {}

    setStrokeAttributes(strokeAttributes: INetworkStrokeAttributes): void {
        const stroke = new Stroke();
        this.applyStrokeAttributes(stroke, strokeAttributes);
        this.strokeContainer.addShape(strokeAttributes.id, stroke);
    }

    drawStroke(strokeCoordinates: INetworkStrokeCoordinates): void {
        const stroke = this.strokeContainer.getShape(strokeCoordinates.id);
        const path = strokeCoordinates.parts[0].trim() + ' ';
        stroke.points += path;
    }

    deleteStroke(id: number): void {
        const stroke = this.strokeContainer.getShape(id);
        stroke.hideShape();
    }

    unDeleteStroke(id: number): void {
        const stroke = this.strokeContainer.getShape(id);
        stroke.showShape();
    }

    changeBackgroundColor(background: INetworkBackground): void {
        const rgba = new Rgba();
        rgba.setFromHexAndOpacity(background.color, background.opacity);
        this.colorManagerService.changeDrawingSurfaceColorValue(rgba);
    }

    private applyStrokeAttributes(stroke: Stroke, strokeAttributes: INetworkStrokeAttributes): void {
        stroke.uid = strokeAttributes.id;
        stroke.primaryColor = strokeAttributes.color;
        stroke.primaryOpacity = strokeAttributes.opacity;
        stroke.strokeWidth = strokeAttributes.strokeWidth;
        stroke.isCircleShown = false;
    }
}
