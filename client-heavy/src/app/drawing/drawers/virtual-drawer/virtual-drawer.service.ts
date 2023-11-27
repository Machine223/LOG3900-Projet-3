import { Injectable } from '@angular/core';
import { INetworkWordImagePair } from 'src/app/word-image-pair/word-image-pair-network-interface/network-word-image-pair';
import { ColorManagerService } from '../color/color-manager.service';
import { Rgba } from '../color/rgba';
import { StrokeContainerService } from '../stroke-container/stroke-container.service';
import { INetworkStrokeAttributes } from '../stroke/network-data/network-stroke-attributes';
import { INetworkStrokeCoordinates } from '../stroke/network-data/network-stroke-coordinates';
import { Stroke } from '../stroke/stroke';

@Injectable({
    providedIn: 'root',
})
export class VirtualDrawerService {
    currentPair: INetworkWordImagePair;
    private _isDrawing: boolean;
    private intervalId: number;
    private currentElementIndex: number;
    private currentPartIndex: number;
    private startTimestamp: number;
    private currentDrawingCount: number;
    private actualDelay: number;

    get isDrawing(): boolean {
        return this._isDrawing;
    }

    constructor(private strokeContainer: StrokeContainerService, private colorManager: ColorManagerService) {}

    setDrawing(pair: INetworkWordImagePair): void {
        if (this._isDrawing) {
            this.stopDrawing();
        }
        this.currentPair = pair;
    }

    startDrawing(desiredDelay?: number): void {
        if (this.intervalId) {
            this.stopDrawing();
        }
        if (this.currentPair) {
            this.currentElementIndex = 0;
            this.currentPartIndex = 0;

            this.strokeContainer.resetContainer();

            const backGroundColor: Rgba = new Rgba();
            backGroundColor.setFromHexAndOpacity(this.currentPair.drawing.background, this.currentPair.drawing.backgroundOpacity);
            this.colorManager.changeDrawingSurfaceColorValue(backGroundColor);

            this.drawAllElements();

            this._isDrawing = true;
            this.actualDelay = desiredDelay ? desiredDelay : this.currentPair.delay;
            this.startTimestamp = Date.now();
            this.currentDrawingCount = 0;
            this.intervalId = setInterval(this.getCallback() as TimerHandler, this.actualDelay);
        }
    }

    stopDrawing(): void {
        clearInterval(this.intervalId);
        this._isDrawing = false;
    }

    getCallback(): () => void {
        return () => {
            while ((Date.now() - this.startTimestamp) / this.actualDelay > this.currentDrawingCount && this.isDrawing) {
                if (this.currentPartIndex === 0) {
                    if (this.currentElementIndex >= this.currentPair.drawing.coordinates.length) {
                        this._isDrawing = false;
                        clearInterval(this.intervalId);
                        return;
                    }
                }
                this.updateStroke();
                this.currentPartIndex++;
                this.currentDrawingCount++;
                if (this.currentPartIndex >= this.currentPair.drawing.coordinates[this.currentElementIndex].parts.length) {
                    this.currentElementIndex++;
                    this.currentPartIndex = 0;
                }
            }
        };
    }

    private drawAllElements(): void {
        this.currentPair.drawing.elements.forEach((strokeAttribute: INetworkStrokeAttributes) => this.addNewElement(strokeAttribute));
    }

    private addNewElement(strokeAttribute: INetworkStrokeAttributes): void {
        const newStroke: Stroke = this.createStroke(strokeAttribute);
        this.strokeContainer.addShape(newStroke.uid, newStroke);
    }

    private createStroke(strokeAttribute: INetworkStrokeAttributes): Stroke {
        const stroke: Stroke = new Stroke();
        stroke.uid = strokeAttribute.id;
        stroke.isVisible = true;
        stroke.isCircleShown = false;
        stroke.primaryColor = strokeAttribute.color;
        stroke.primaryOpacity = strokeAttribute.opacity;
        stroke.strokeWidth = strokeAttribute.strokeWidth;
        stroke.isSelectable = false;
        return stroke;
    }

    private updateStroke(): void {
        const coordinates: INetworkStrokeCoordinates = this.currentPair.drawing.coordinates[this.currentElementIndex];
        const newPart: string = coordinates.parts[this.currentPartIndex];
        this.strokeContainer.getShape(coordinates.id).points += newPart.trim() + ' ';
    }
}
