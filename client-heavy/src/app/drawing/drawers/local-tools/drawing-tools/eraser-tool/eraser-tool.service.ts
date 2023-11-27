import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DrawingSurfaceInfoService } from 'src/app/drawing/drawing-view/drawing-surface-info.service';
import { DrawingWindowInfoService } from 'src/app/drawing/drawing-view/drawing-window-info.service';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { StrokeContainerService } from '../../../stroke-container/stroke-container.service';
import { Point } from '../../../stroke/point';
import { Rectangle } from '../../../stroke/rectangle';
import { Stroke } from '../../../stroke/stroke';
import { MultipleAction } from '../../undo-redo/multiple-action';
import { SingleAction } from '../../undo-redo/single-action';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import { DrawingTool } from '../drawing-tool';
import { EraserShape } from './eraser-shape';
import { RedRectangle } from './red-rectangle';

@Injectable({
    providedIn: 'root',
})
export class EraserToolService extends DrawingTool {
    private nextErasedShapeUid: number;
    private eraserShapeData: EraserShape;
    private redRectangle: Rectangle;
    private isErasing: boolean;
    private erasedShapeUids: number[];
    sideLength: number;

    private eraserRectangleChangeSource = new Subject<Rectangle>();
    eraserRectangleChange = this.eraserRectangleChangeSource.asObservable();

    constructor(
        private shapeContainer: StrokeContainerService,
        public undoRedoService: UndoRedoService,
        private windowInfoTracker: DrawingWindowInfoService,
        private constants: ConstantsRepositoryService,
        private drawingTracker: DrawingSurfaceInfoService,
    ) {
        super();
        this.subscriptions.push(this.undoRedoService.onUndoRedo.subscribe(() => this.updateEraserArea()));
        this.nextErasedShapeUid = this.constants.INVALID_UID;
        this.eraserShapeData = new EraserShape();
        this.redRectangle = new Rectangle();
        this.isErasing = false;
        this.erasedShapeUids = [];
        this.sideLength = constants.INITIAL_ERASER_SIZE;
    }

    setEraserRectangleChange(eraserRectangle: EraserShape): void {
        this.eraserShapeData = eraserRectangle;
        this.setSideLength(this.constants.INITIAL_ERASER_SIZE);
    }

    setRedRectangle(redRectangle: RedRectangle): void {
        this.redRectangle = redRectangle.perimeter;
    }

    onMouseUp(clickInfo: MouseEvent): void {
        this.isErasing = false;
        if (this.erasedShapeUids.length !== 0) {
            const multipleEraseAction = new MultipleAction();
            for (const erasedShapeUid of this.erasedShapeUids) {
                const shapeToErase: Stroke = this.shapeContainer.getShape(erasedShapeUid);
                const eraseAction: SingleAction = new SingleAction();
                eraseAction.undo = () => shapeToErase.showShape();
                eraseAction.redo = () => shapeToErase.hideShape();
                multipleEraseAction.addAction(eraseAction);
            }
            this.undoRedoService.addNewAction(multipleEraseAction);
            this.erasedShapeUids = [];
        }
    }

    onMouseDown(clickInfo: MouseEvent): void {
        if (clickInfo.button === this.constants.LEFT_MOUSE_BUTTON_ID) {
            this.isErasing = true;
            this.eraseShape();
        }
    }

    onMouseMove(clickInfo: MouseEvent): void {
        const mousePosition: Point = this.windowInfoTracker.getMousePositionWithOffset(clickInfo);
        this.eraserShapeData.perimeter.centerAroundPoint(mousePosition);
        this.updateEraserArea();
        if (this.isErasing) {
            this.eraseShape();
        }
    }

    eraseShape(): void {
        if (this.nextErasedShapeUid !== this.constants.INVALID_UID) {
            const shapeToErase: Stroke = this.shapeContainer.getShape(this.nextErasedShapeUid);
            shapeToErase.hideShape();
            this.erasedShapeUids.push(this.nextErasedShapeUid);
            this.updateEraserArea();
        }
    }

    putShapeInEraseArea(uid: number): void {
        if (this.nextErasedShapeUid === this.constants.INVALID_UID || uid > this.nextErasedShapeUid) {
            this.nextErasedShapeUid = uid;
            this.updateRedRectangle();
        }
    }

    updateRedRectangle(): void {
        const potentialErasedShape: Stroke = this.shapeContainer.getShape(this.nextErasedShapeUid);
        this.redRectangle.copy(potentialErasedShape.getBoundingRectangle());
    }

    resetEraser(): void {
        this.resetRedRectangle();
        const eraserRectangle: Rectangle = this.eraserShapeData.perimeter;
        eraserRectangle.setStart(this.constants.INVALID_POSITION, this.constants.INVALID_POSITION);
        eraserRectangle.setEnd(
            this.constants.INVALID_POSITION + eraserRectangle.width,
            this.constants.INVALID_POSITION + eraserRectangle.height,
            false,
        );
    }

    resetRedRectangle(): void {
        this.redRectangle.setStart(this.constants.INVALID_POSITION, this.constants.INVALID_POSITION);
        this.redRectangle.setEnd(this.constants.INVALID_POSITION, this.constants.INVALID_POSITION, false);
    }

    updateEraserArea(): void {
        this.nextErasedShapeUid = this.constants.INVALID_UID;
        this.eraserRectangleChangeSource.next(this.eraserShapeData.perimeter);
        if (this.nextErasedShapeUid === this.constants.INVALID_UID) {
            this.resetRedRectangle();
        }
    }

    onToolChange(): void {
        this.resetEraser();
    }

    onToolInitiate(): void {
        this.initiateEraserRectangle();
    }

    onPanelToggle(): void {
        this.initiateEraserRectangle();
    }

    initiateEraserRectangle(): void {
        const drawingSurface: Rectangle = new Rectangle();
        drawingSurface.setStart(0, 0);
        drawingSurface.setEnd(this.drawingTracker.getWidth(), this.drawingTracker.getHeight(), false);
    }

    onMouseLeave(): void {
        this.resetEraser();
    }

    setSideLength(sideLength: number): void {
        const upperLeftCorner: Point = this.eraserShapeData.perimeter.upperLeftCorner;
        const newBottomRightCorner: Point = upperLeftCorner.plus(new Point(sideLength, sideLength));
        this.eraserShapeData.perimeter.setEnd(newBottomRightCorner.x, newBottomRightCorner.y, false);
        this.sideLength = sideLength;
    }
}
