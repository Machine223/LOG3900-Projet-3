import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ColorManagerService } from '../drawing/drawers/color/color-manager.service';
import { Rgba } from '../drawing/drawers/color/rgba';
import { StrokeContainerService } from '../drawing/drawers/stroke-container/stroke-container.service';
import { INetworkStrokeAttributes } from '../drawing/drawers/stroke/network-data/network-stroke-attributes';
import { INetworkStrokeCoordinates } from '../drawing/drawers/stroke/network-data/network-stroke-coordinates';
import { Point } from '../drawing/drawers/stroke/point';
import { Stroke } from '../drawing/drawers/stroke/stroke';
import { VirtualDrawerService } from '../drawing/drawers/virtual-drawer/virtual-drawer.service';
import { DrawingSurfaceInfoService } from '../drawing/drawing-view/drawing-surface-info.service';
import { ConstantsRepositoryService } from '../helpers/constants-repository.service';
import { AlertService } from '../pop-up/alert/alert.service';
import { CreationMode } from './enums/creationMode';
import { Difficulty } from './enums/difficulty';
import { DrawingMode } from './enums/drawing-mode';
import { ImageConverterService } from './pair-creation-view/pair-generation/converter-process/image-converter.service';
import { INetworkDrawing } from './word-image-pair-network-interface/network-drawing';
import { INetworkWordImagePair } from './word-image-pair-network-interface/network-word-image-pair';

@Injectable({
    providedIn: 'root',
})
export class PairCreatorService {
    private readonly drawingDurationConverter: Map<Difficulty, number>;
    private savedDrawing: Map<number, Stroke>;
    private savedBackgroundColor: Rgba;
    private currentPair: INetworkWordImagePair;

    word: string;
    hints: string[];
    difficulty: Difficulty;
    drawingMode: DrawingMode;
    creationMode: CreationMode;
    savedCreationMode: CreationMode;

    onlineSelectedWord: string;

    base64Image: string;
    base64CroppedImage: string;

    constructor(
        private http: HttpClient,
        private constants: ConstantsRepositoryService,
        private alertService: AlertService,
        private strokeContainer: StrokeContainerService,
        private colorManager: ColorManagerService,
        private drawingSurfaceInfo: DrawingSurfaceInfoService,
        private virtualDrawer: VirtualDrawerService,
        private imageConverter: ImageConverterService,
    ) {
        this.word = '';
        this.hints = [];
        this.difficulty = Difficulty.Easy;
        this.drawingMode = DrawingMode.Classic;
        this.drawingDurationConverter = new Map<Difficulty, number>([
            [Difficulty.Easy, this.constants.EASY_DRAWING_DURATION],
            [Difficulty.Moderate, this.constants.MODERATE_DRAWING_DURATION],
            [Difficulty.Hard, this.constants.HARD_DRAWING_DURATION],
        ]);
        this.creationMode = CreationMode.Manual;
        this.savedDrawing = new Map<number, Stroke>();
    }

    saveDrawing(): void {
        this.resetSavedBase64Images();
        this.savedDrawing = this.strokeContainer.getVisibleShapes();
        this.savedBackgroundColor = this.colorManager.getDrawingSurfaceColorValue();
        this.handlerCreationModeRestrictions();
        if (this.savedCreationMode === CreationMode.OnlineSearch) {
            this.word = this.onlineSelectedWord;
        }
    }

    handlerCreationModeRestrictions(): void {
        this.savedCreationMode = this.creationMode;
        if (
            (this.savedCreationMode === CreationMode.Import || this.savedCreationMode === CreationMode.OnlineSearch) &&
            this.drawingMode === DrawingMode.Classic
        ) {
            this.drawingMode = DrawingMode.Random;
        }
    }

    buildPair(): void {
        const drawing: INetworkDrawing = this.buildDrawing();
        this.currentPair = {
            word: this.word,
            hints: this.hints,
            difficulty: this.difficulty,
            delay: this.computeDelay(drawing),
            isRandom: this.drawingMode === DrawingMode.Random,
            drawing,
        };
    }

    computeDelay(drawing: INetworkDrawing): number {
        const length = drawing.coordinates.reduce((total: number, coordinate: INetworkStrokeCoordinates) => {
            return total + coordinate.parts.length;
        }, 0);
        const duration = this.drawingDurationConverter.get(this.difficulty);

        let delay = Math.round((duration * 1000) / length);
        delay = Math.min(delay, this.constants.MAX_DELAY);
        delay = Math.max(delay, this.constants.MIN_DELAY);
        return delay;
    }

    uploadPair(): void {
        this.http.post(`${this.constants.URI}/pair`, this.currentPair).subscribe(
            (response: Response) => {
                const TITLE = 'Success';
                const CONTENT = 'Word-image pair uploaded successfully';
                this.alertService.alertSuccess(TITLE, CONTENT);
                this.resetValues();
                this.strokeContainer.resetContainer();
            },
            (error) => {
                const TITLE = `Error ${error.status}`;
                const CONTENT = 'There was a problem when uploading the word-image pair';
                this.alertService.alertError(TITLE, CONTENT);
            },
        );
    }

    hasSavedDrawing(): boolean {
        return this.savedDrawing.size !== 0;
    }

    resetContainerWithSavedDrawing(): void {
        this.strokeContainer.setStrokes(this.savedDrawing);
        this.colorManager.changeDrawingSurfaceColorValue(this.savedBackgroundColor);
    }

    resetValues(): void {
        this.savedDrawing = new Map<number, Stroke>();
        this.currentPair = undefined;

        this.word = '';
        this.hints = [];
        this.difficulty = Difficulty.Easy;
        this.drawingMode = DrawingMode.Classic;
        this.creationMode = CreationMode.Manual;
    }

    resetSavedBase64Images(): void {
        this.base64Image = null;
        this.base64CroppedImage = null;
        this.imageConverter.resetValues();
    }

    prepareVirtualDrawer(): void {
        this.colorManager.changeDrawingSurfaceColorValue(this.savedBackgroundColor);
        this.buildPair();
        this.virtualDrawer.setDrawing(this.currentPair);
    }

    randomizeCoordinates(): void {
        const coordinates: INetworkStrokeCoordinates[] = this.currentPair.drawing.coordinates;
        for (let i: number = coordinates.length - 1; i >= 0; i--) {
            const newIndex = Math.floor(Math.random() * (i + 1));
            [coordinates[i], coordinates[newIndex]] = [coordinates[newIndex], coordinates[i]];
        }
    }

    convertImage(): void {
        this.colorManager.resetAll();
        this.imageConverter.resetValues();
        this.imageConverter.isConverting = true;
        setTimeout(() => this.imageConverter.convertAndDraw(this.base64CroppedImage), 500);
    }

    private buildDrawing(): INetworkDrawing {
        let drawingElements: INetworkStrokeAttributes[];
        let elementCoordinates: INetworkStrokeCoordinates[];
        [drawingElements, elementCoordinates] = this.buildElements();
        const backgroundColor: Rgba = this.savedBackgroundColor;
        const drawing: INetworkDrawing = {
            background: backgroundColor.rgbToHex(),
            backgroundOpacity: backgroundColor.a,
            elements: drawingElements,
            coordinates: elementCoordinates,
        };

        return drawing;
    }

    private buildElements(): [INetworkStrokeAttributes[], INetworkStrokeCoordinates[]] {
        let strokes: Stroke[] = Array.from(this.savedDrawing.values());
        if (this.drawingMode !== DrawingMode.Random) {
            const sorter: (a: Stroke, b: Stroke) => number = this.getSorter();
            strokes = strokes.sort(sorter);
        }
        let drawingElements: INetworkStrokeAttributes[] = [];
        const drawingCoordinates: INetworkStrokeCoordinates[] = [];
        strokes.forEach((stroke: Stroke) => {
            const drawingElement: INetworkStrokeAttributes = {
                gameroomName: '',
                id: stroke.uid,
                color: stroke.primaryColor,
                opacity: stroke.primaryOpacity,
                strokeWidth: stroke.strokeWidth,
            };
            drawingElements.push(drawingElement);

            const splittedPath: string[] = stroke.points.split(new RegExp('\\s(?=[a-z,A-Z])'));
            const drawingCoordinate: INetworkStrokeCoordinates = {
                gameroomName: '',
                id: stroke.uid,
                parts: splittedPath,
            };
            drawingCoordinates.push(drawingCoordinate);
        });

        drawingElements = drawingElements.sort(this.getUidSorter());
        return [drawingElements, drawingCoordinates];
    }

    private getSorter(): (a: Stroke, b: Stroke) => number {
        switch (this.drawingMode) {
            case DrawingMode.Classic: {
                return (a: Stroke, b: Stroke) => a.uid - b.uid;
            }
            case DrawingMode.PanoramicLeft: {
                return (a: Stroke, b: Stroke) => a.firstCoordinate.x - b.firstCoordinate.x;
            }
            case DrawingMode.PanoramicTop: {
                return (a: Stroke, b: Stroke) => a.firstCoordinate.y - b.firstCoordinate.y;
            }
            case DrawingMode.PanoramicRight: {
                return (a: Stroke, b: Stroke) => b.firstCoordinate.x - a.firstCoordinate.x;
            }
            case DrawingMode.PanoramicBottom: {
                return (a: Stroke, b: Stroke) => b.firstCoordinate.y - a.firstCoordinate.y;
            }
            case DrawingMode.CenteredInside: {
                const width = this.drawingSurfaceInfo.getWidth();
                const height = this.drawingSurfaceInfo.getHeight();
                const centerPoint: Point = new Point(width, height).getScaledWith(new Point(2, 2));
                return (a: Stroke, b: Stroke) =>
                    a.firstCoordinate.getEuclidianDistance(centerPoint) - b.firstCoordinate.getEuclidianDistance(centerPoint);
            }
            case DrawingMode.CenteredOutside: {
                const width = this.drawingSurfaceInfo.getWidth();
                const height = this.drawingSurfaceInfo.getHeight();
                const centerPoint: Point = new Point(width, height).getScaledWith(new Point(2, 2));
                return (a: Stroke, b: Stroke) =>
                    b.firstCoordinate.getEuclidianDistance(centerPoint) - a.firstCoordinate.getEuclidianDistance(centerPoint);
            }
            default: {
                return (a: Stroke, b: Stroke) => 0;
            }
        }
    }

    private getUidSorter(): (a: INetworkStrokeAttributes, b: INetworkStrokeAttributes) => number {
        return (a: INetworkStrokeAttributes, b: INetworkStrokeAttributes) => a.id - b.id;
    }
}
