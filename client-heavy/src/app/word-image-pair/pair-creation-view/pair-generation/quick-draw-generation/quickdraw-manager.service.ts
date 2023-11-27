import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ndjsonStream from 'can-ndjson-stream';
import { StrokeContainerService } from 'src/app/drawing/drawers/stroke-container/stroke-container.service';
import { Point } from 'src/app/drawing/drawers/stroke/point';
import { Stroke } from 'src/app/drawing/drawers/stroke/stroke';
import { DrawingSurfaceInfoService } from 'src/app/drawing/drawing-view/drawing-surface-info.service';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { UidGeneratorService } from 'src/app/helpers/uid-generator.service';
import { IQuickDrawData } from './quick-draw-interface';
import { quickDrawCategories } from './quickdraw-categories';

@Injectable({
    providedIn: 'root',
})
export class QuickdrawManagerService {
    private quickDrawDrawingsGeneration: Map<string, IQuickDrawData>;
    private quickDrawDrawings: IQuickDrawData[];
    private currentIndex: number;

    strokeWidth: number;
    strokeColor: string;
    opacity: number;

    get hasPrevious(): boolean {
        return this.currentIndex > 0;
    }

    get hasNext(): boolean {
        return this.currentIndex < this.quickDrawDrawings.length - 1;
    }

    get currentTitle(): string {
        return this.quickDrawDrawings[this.currentIndex].word;
    }

    constructor(
        private constants: ConstantsRepositoryService,
        private strokeContainer: StrokeContainerService,
        private http: HttpClient,
        private uidGenerator: UidGeneratorService,
        private drawingInfo: DrawingSurfaceInfoService,
    ) {
        this.quickDrawDrawingsGeneration = new Map<string, IQuickDrawData>();
        this.quickDrawDrawings = [];
        this.currentIndex = 0;
        this.strokeWidth = 1;
        this.strokeColor = this.constants.BLACK_COLOR;
        this.opacity = 1;
    }

    updateStrokeWidth(): void {
        this.strokeContainer.changeAllStrokeWidth(this.strokeWidth);
    }

    updateStrokeColor(): void {
        this.strokeContainer.changeAllStrokeColor(this.strokeColor);
    }

    updateOpacity(): void {
        this.strokeContainer.changeAllStrokeOpacity(this.opacity);
    }

    resetValues(): void {
        this.currentIndex = 0;
        this.strokeWidth = 1;
        this.strokeColor = this.constants.BLACK_COLOR;
        this.opacity = 1;
    }

    resetDrawings(): void {
        this.quickDrawDrawings = [];
        this.currentIndex = 0;
        this.updateDrawingSize();
    }

    drawCurrent(): void {
        const drawing: IQuickDrawData = this.quickDrawDrawings[this.currentIndex];
        this.drawDrawing(drawing);
    }

    drawNext(): void {
        this.currentIndex++;
        this.updateDrawingSize();
        this.drawCurrent();
    }

    drawPrevious(): void {
        this.currentIndex--;
        this.drawCurrent();
    }

    flushSeenDrawings(): void {
        const nSeenDrawings: number = this.quickDrawDrawings.length - this.constants.MINIMUM_UNSEEN_DRAWINGS;
        this.quickDrawDrawings.splice(0, nSeenDrawings);
        this.currentIndex = 0;
    }

    sawTheFirst(): void {
        this.updateDrawingSize();
    }

    private updateDrawingSize(): void {
        if (this.quickDrawDrawings.length - this.currentIndex <= this.constants.MINIMUM_UNSEEN_DRAWINGS) {
            this.http.get(`${this.constants.URI}/pair/quick-draw-random`).subscribe((newDrawing: any) => {
                this.quickDrawDrawings.push(newDrawing.quickDrawPair as IQuickDrawData);
                this.updateDrawingSize();
            });
        }
    }

    private drawDrawing(drawing: IQuickDrawData): void {
        this.strokeContainer.resetContainer();
        drawing.drawing.forEach((coords: number[][]) => {
            const stroke: Stroke = this.createStroke(coords);
            this.strokeContainer.addShape(stroke.uid, stroke);
        });
    }

    private createStroke(coords: number[][]): Stroke {
        const stroke = new Stroke();
        stroke.uid = this.uidGenerator.getNewUid();
        stroke.strokeWidth = this.strokeWidth;
        stroke.isCircleShown = false;
        stroke.primaryColor = this.strokeColor;
        stroke.primaryOpacity = this.opacity;
        for (let i = 0; i < coords[0].length; i++) {
            if (i === 0) {
                stroke.firstCoordinate = new Point(coords[0][i], coords[1][i]);
                stroke.addPoints(coords[0][i], coords[1][i], this.strokeWidth);
            } else {
                stroke.addLine(coords[0][i], coords[1][i]);
            }
        }
        return stroke;
    }

    generateSimplifiedQuickDrawJson(): void {
        quickDrawCategories.forEach((category: string) => {
            const completeURI = this.constants.QUICKDRAW_SIMPLIFIED_URL + category + '.ndjson';
            const abortController = new AbortController();
            const signal = abortController.signal;
            let nCopies = 0;
            fetch(completeURI, { signal })
                .then((response: Response) => {
                    return ndjsonStream(response.body);
                })
                .then((readableStream: ReadableStream<IQuickDrawData>) => {
                    const reader: ReadableStreamDefaultReader<IQuickDrawData> = readableStream.getReader();
                    let read;
                    reader.read().then(
                        (read = (result: ReadableStreamReadResult<IQuickDrawData>) => {
                            if (result.done) {
                                return;
                            }
                            if (result.value.recognized) {
                                this.resizeSimplifiedQuickDraw(result.value);
                                this.quickDrawDrawingsGeneration[result.value.timestamp] = result.value;
                                nCopies++;
                                if (nCopies === 10) {
                                    abortController.abort();
                                    reader.releaseLock();
                                    readableStream.cancel();
                                    if (category === 'zigzag') {
                                        setTimeout(() => {
                                            const dataStr =
                                                'data:text/json;charset=utf-8,' +
                                                encodeURIComponent(JSON.stringify(this.quickDrawDrawingsGeneration));
                                            const dlAnchorElem: HTMLAnchorElement = document.createElement('a');
                                            dlAnchorElem.setAttribute('href', dataStr);
                                            dlAnchorElem.setAttribute('download', 'scene.json');
                                            dlAnchorElem.click();
                                        }, 1000);
                                    }
                                }
                            }
                            reader.read().then(read);
                        }),
                    );
                });
        });
    }

    generateRawQuickDrawJson(): void {
        quickDrawCategories.forEach((category: string) => {
            const completeURI = this.constants.QUICKDRAW_RAW_URL + category + '.ndjson';
            const abortController = new AbortController();
            const signal = abortController.signal;
            let nCopies = 0;
            fetch(completeURI, { signal })
                .then((response: Response) => {
                    return ndjsonStream(response.body);
                })
                .then((readableStream: ReadableStream<IQuickDrawData>) => {
                    const reader: ReadableStreamDefaultReader<IQuickDrawData> = readableStream.getReader();
                    let read;
                    reader.read().then(
                        (read = (result: ReadableStreamReadResult<IQuickDrawData>) => {
                            if (result.done) {
                                return;
                            }
                            if (result.value.recognized) {
                                this.resizeRawQuickDraw(result.value);
                                this.quickDrawDrawingsGeneration[result.value.timestamp] = result.value;
                                nCopies++;
                                if (nCopies === 10) {
                                    abortController.abort();
                                    reader.releaseLock();
                                    readableStream.cancel();
                                    if (category === 'zigzag') {
                                        setTimeout(() => {
                                            const dataStr =
                                                'data:text/json;charset=utf-8,' +
                                                encodeURIComponent(JSON.stringify(this.quickDrawDrawingsGeneration));
                                            const dlAnchorElem: HTMLAnchorElement = document.createElement('a');
                                            dlAnchorElem.setAttribute('href', dataStr);
                                            dlAnchorElem.setAttribute('download', 'scene.json');
                                            dlAnchorElem.click();
                                        }, 1000);
                                    }
                                }
                            }
                            reader.read().then(read);
                        }),
                    );
                });
        });
    }

    private resizeSimplifiedQuickDraw(drawing: IQuickDrawData): void {
        const scale = this.drawingInfo.getHeight() / this.constants.QUICKDRAW_SIMPLIFIED_DIMENSIONS;
        drawing.drawing.forEach((coords: number[][]) => {
            for (let i = 0; i < coords[0].length; i++) {
                coords[0][i] = Math.round(coords[0][i] * scale);
                coords[1][i] = Math.round(coords[1][i] * scale);
            }
        });
    }

    private resizeRawQuickDraw(drawing: IQuickDrawData): void {
        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
        let maxX = Number.MIN_VALUE;
        let maxY = Number.MIN_VALUE;
        drawing.drawing.forEach((coords: number[][]) => {
            for (let i = 0; i < coords[0].length; i++) {
                if (coords[0][i] > maxX) {
                    maxX = coords[0][i];
                }
                if (coords[0][i] < minX) {
                    minX = coords[0][i];
                }
                if (coords[1][i] > maxY) {
                    maxY = coords[1][i];
                }
                if (coords[1][i] < minY) {
                    minY = coords[1][i];
                }
            }
        });

        const width: number = maxX - minX;
        const height: number = maxY - minY;
        const maxDimension: number = Math.max(width, height);
        const scale: number = this.drawingInfo.getHeight() / maxDimension;

        let yOffsetToCenter;
        let xOffsetToCenter;
        if (width > height) {
            const finalHeight: number = height * scale;
            yOffsetToCenter = Math.round((this.drawingInfo.getHeight() - finalHeight) / 2);
            xOffsetToCenter = 0;
        } else {
            const finalWidth: number = width * scale;
            xOffsetToCenter = Math.round((this.drawingInfo.getWidth() - finalWidth) / 2);
            yOffsetToCenter = 0;
        }

        const xOffset = minX;
        const yOffset = minY;

        drawing.drawing.forEach((coords: number[][]) => {
            for (let i = 0; i < coords[0].length; i++) {
                coords[0][i] -= xOffset;
                coords[1][i] -= yOffset;

                coords[0][i] = Math.round(coords[0][i] * scale);
                coords[1][i] = Math.round(coords[1][i] * scale);

                coords[0][i] += xOffsetToCenter;
                coords[1][i] += yOffsetToCenter;
            }
            coords.splice(2, 1);
        });
    }
}
