import { Point } from 'src/app/drawing/drawers/stroke/point';
import { StrokeCommunicationsService } from 'src/app/game/communications/stroke-communications.service';
import { GameroomManagerService } from 'src/app/gameroom/gameroom-manager.service';
import { createLinePath, createMovePath } from 'src/app/helpers/path';
import { Rgba } from '../color/rgba';
import { ICircleElement } from './circle-element';
import { INetworkStrokeCoordinates } from './network-data/network-stroke-coordinates';
import { INetworkStrokeId } from './network-data/network-stroke-id';
import { Rectangle } from './rectangle';

const INVALID_UID = -1;

export class Stroke {
    protected shapeReference: SVGSVGElement;
    uid: number;
    isVisible: boolean;
    points: string;
    strokeWidth: number;
    circle: ICircleElement;
    isCircleShown: boolean;
    primaryColor: string;
    primaryOpacity: number;
    isSelectable: boolean;
    firstCoordinate: Point;

    onShapeReferenceSet: () => void;
    detectChanges: () => void;

    constructor(private strokeCommunications?: StrokeCommunicationsService, private gameroomManager?: GameroomManagerService) {
        this.uid = INVALID_UID;
        this.isVisible = true;
        this.points = '';
        this.isCircleShown = false;
        this.isSelectable = true;
    }

    copy(stroke: Stroke): void {
        this.uid = stroke.uid;
        this.points = stroke.points;
        this.strokeWidth = stroke.strokeWidth;
        this.circle = stroke.circle;
        this.isCircleShown = stroke.isCircleShown;
        this.primaryColor = stroke.primaryColor;
        this.primaryOpacity = stroke.primaryOpacity;
        this.firstCoordinate = new Point(stroke.firstCoordinate.x, stroke.firstCoordinate.y);
    }

    setShapeReference(shapeReference: SVGSVGElement): void {
        this.shapeReference = shapeReference;
        if (this.onShapeReferenceSet !== undefined) {
            this.onShapeReferenceSet();
        }
    }

    showShape(): void {
        this.isVisible = true;
        this.isSelectable = true;

        if (this.strokeCommunications && this.gameroomManager) {
            const strokeId: INetworkStrokeId = { gameroomName: this.gameroomManager.currentGameroom.name, id: this.uid };
            this.strokeCommunications.emitUnDeleteStroke(strokeId);
        }
    }

    hideShape(): void {
        this.isVisible = false;
        this.isSelectable = false;

        if (this.strokeCommunications && this.gameroomManager) {
            const strokeId: INetworkStrokeId = { gameroomName: this.gameroomManager.currentGameroom.name, id: this.uid };
            this.strokeCommunications.emitDeleteStroke(strokeId);
        }
    }

    isShapeShown(): boolean {
        return this.isVisible;
    }

    getPrimaryColor(): Rgba {
        const primaryColor: Rgba = new Rgba();
        primaryColor.setFromHexAndOpacity(this.primaryColor, this.primaryOpacity);
        return primaryColor;
    }

    getBoundingRectangle(): Rectangle {
        const boundingRectangle: Rectangle = new Rectangle();
        const boundingBox: DOMRect = this.shapeReference.getBBox();

        const extraWidth: Point = this.getExtraBoundingBoxWidth();

        boundingRectangle.setStart(boundingBox.x - extraWidth.x, boundingBox.y - extraWidth.y);
        boundingRectangle.setEnd(
            boundingBox.x + boundingBox.width + extraWidth.x,
            boundingBox.y + boundingBox.height + extraWidth.y,
            false,
        );
        return boundingRectangle;
    }

    getExtraBoundingBoxWidth(): Point {
        if (this.isCircleShown) {
            return new Point(0, 0);
        } else {
            const extraWidthX: number = Math.abs(this.circle.r);
            const extraWidthY: number = Math.abs(this.circle.r);
            return new Point(extraWidthX, extraWidthY);
        }
    }

    addPoints(x: number, y: number, radius: number): void {
        this.circle = { cx: x, cy: y, r: radius } as ICircleElement;
        this.firstCoordinate = new Point(x, y);
        const movePath = createMovePath(x, y);
        this.points += movePath;

        if (this.strokeCommunications && this.gameroomManager) {
            const coordinates: INetworkStrokeCoordinates = {
                gameroomName: this.gameroomManager.currentGameroom.name,
                id: this.uid,
                parts: [movePath.trim()],
            };
            this.strokeCommunications.emitStrokeCoordinates(coordinates);
        }
    }

    removeCircle(): void {
        if (this.isCircleShown) {
            this.isCircleShown = false;
        }
    }

    addLine(x: number, y: number): void {
        const linePath = createLinePath(x, y);
        this.points += linePath;
        if (this.strokeCommunications && this.gameroomManager) {
            const coordinates: INetworkStrokeCoordinates = {
                gameroomName: this.gameroomManager.currentGameroom.name,
                id: this.uid,
                parts: [linePath.trim()],
            };
            this.strokeCommunications.emitStrokeCoordinates(coordinates);
        }
    }
}
