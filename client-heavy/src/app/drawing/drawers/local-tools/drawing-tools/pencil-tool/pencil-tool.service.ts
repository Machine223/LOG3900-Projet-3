import { Injectable } from '@angular/core';
import { Point } from 'src/app/drawing/drawers/stroke/point';
import { DrawingWindowInfoService } from 'src/app/drawing/drawing-view/drawing-window-info.service';
import { StrokeCommunicationsService } from 'src/app/game/communications/stroke-communications.service';
import { GameLocalStateService } from 'src/app/game/game-local-state.service';
import { GameroomManagerService } from 'src/app/gameroom/gameroom-manager.service';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { UidGeneratorService } from 'src/app/helpers/uid-generator.service';
import { ColorManagerService } from '../../../color/color-manager.service';
import { StrokeContainerService } from '../../../stroke-container/stroke-container.service';
import { INetworkStrokeAttributes } from '../../../stroke/network-data/network-stroke-attributes';
import { Stroke } from '../../../stroke/stroke';
import { SingleAction } from '../../undo-redo/single-action';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import { DrawingTool } from '../drawing-tool';

@Injectable({
    providedIn: 'root',
})
export class PencilToolService extends DrawingTool {
    public thickness: number;
    constructor(
        private strokeContainer: StrokeContainerService,
        private uidGenerator: UidGeneratorService,
        private drawingWindowInfo: DrawingWindowInfoService,
        private constants: ConstantsRepositoryService,
        private colorService: ColorManagerService,
        private undoRedoService: UndoRedoService,
        private strokeCommunicationsService: StrokeCommunicationsService,
        private gameLocalStateService: GameLocalStateService,
        private gameroomManager: GameroomManagerService,
    ) {
        super();
        this.currentShapeId = this.constants.INVALID_UID;
        this.thickness = constants.DEFAULT_PENCIL_THICKNESS;
    }

    onMouseDown(clickInfo: MouseEvent): void {
        if (clickInfo.button === this.constants.LEFT_MOUSE_BUTTON_ID) {
            const correctedClickPosition: Point = this.drawingWindowInfo.getMousePositionWithOffset(clickInfo);

            this.drawStroke(correctedClickPosition);
        }
    }

    drawStroke(position: Point): void {
        const stroke = this.createStroke();
        stroke.addPoints(position.x, position.y, this.thickness / 2);
        stroke.addLine(position.x, position.y);
        this.strokeContainer.addShape(this.currentShapeId, stroke);
        this.addShapeAdditionAction(stroke);
    }

    onMouseMove(clickInfo: MouseEvent): void {
        if (this.currentShapeId !== this.constants.INVALID_UID) {
            const stroke: Stroke = this.strokeContainer.getShape(this.currentShapeId);
            const correctedClickPosition: Point = this.drawingWindowInfo.getMousePositionWithOffset(clickInfo);

            this.updateShape(stroke, correctedClickPosition);

            stroke.removeCircle();
        }
    }

    updateShape(stroke: Stroke, position: Point): void {
        stroke.addLine(position.x, position.y);
    }

    onMouseUp(): void {
        this.currentShapeId = this.constants.INVALID_UID;
    }

    onWindowLeave(): void {
        this.onMouseUp();
    }

    addShapeAdditionAction(stroke: Stroke): void {
        const newAction: SingleAction = new SingleAction();
        newAction.undo = () => {
            stroke.hideShape();
        };
        newAction.redo = () => {
            stroke.showShape();
        };
        this.undoRedoService.addNewAction(newAction);
    }

    setThickness(thickness: number): void {
        this.thickness = thickness;
    }

    private createStroke(): Stroke {
        this.currentShapeId = this.uidGenerator.getNewUid();
        const stroke = this.gameLocalStateService.isEmitting
            ? new Stroke(this.strokeCommunicationsService, this.gameroomManager)
            : new Stroke();
        stroke.uid = this.currentShapeId;
        stroke.strokeWidth = this.thickness;
        stroke.primaryColor = this.colorService.getPrimaryColorValue().rgbToHex();
        stroke.primaryOpacity = this.colorService.getPrimaryColorValue().a;

        if (this.gameLocalStateService.isEmitting) {
            const strokeData: INetworkStrokeAttributes = {
                gameroomName: this.gameroomManager.currentGameroom.name,
                id: stroke.uid,
                color: stroke.primaryColor,
                opacity: stroke.primaryOpacity,
                strokeWidth: stroke.strokeWidth,
            };
            this.strokeCommunicationsService.emitStrokeAttributes(strokeData);
        }

        return stroke;
    }
}
