import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Stroke } from '../stroke/stroke';

@Injectable({
    providedIn: 'root',
})
export class StrokeContainerService {
    private strokes: Map<number, Stroke>;

    private lastIdSource = new Subject<number>();
    lastId = this.lastIdSource.asObservable();

    private onResetContainerSource = new Subject<void>();
    onResetContainer = this.onResetContainerSource.asObservable();

    private onRedrawStrokesSource = new Subject<void>();
    onRedrawStrokes = this.onRedrawStrokesSource.asObservable();

    private onUpdateSurfaceSource = new Subject<void>();
    onUpdateSurface = this.onUpdateSurfaceSource.asObservable();

    constructor() {
        this.strokes = new Map<number, Stroke>();
    }

    getVisibleShapes(): Map<number, Stroke> {
        const visibleShapes: Map<number, Stroke> = new Map<number, Stroke>();
        this.strokes.forEach((value: Stroke, key: number) => {
            if (value.isVisible) {
                const copyStroke: Stroke = new Stroke();
                copyStroke.copy(value);
                visibleShapes.set(key, copyStroke);
            }
        });
        return visibleShapes;
    }

    getShapes(): Map<number, Stroke> {
        return this.strokes;
    }

    addShape(uid: number, shapeData: Stroke): void {
        this.strokes.set(uid, shapeData);
        this.lastIdSource.next(uid);
    }

    getShape(uid: number): Stroke {
        const shapeData: Stroke | undefined = this.strokes.get(uid);
        if (shapeData === undefined) {
            throw Error(uid + ' is an invalid UID');
        }
        return shapeData as Stroke;
    }

    resetContainer(): void {
        this.onResetContainerSource.next();
        this.strokes = new Map<number, Stroke>();
    }

    isEmpty(): boolean {
        return this.strokes.size === 0;
    }

    redrawStrokes(): void {
        this.onRedrawStrokesSource.next();
    }

    setStrokes(strokes: Map<number, Stroke>): void {
        this.onResetContainerSource.next();
        this.strokes = new Map<number, Stroke>();
        strokes.forEach((value: Stroke, key: number) => {
            const strokeCopy: Stroke = new Stroke();
            strokeCopy.copy(value);
            this.strokes.set(key, strokeCopy);
        });

        this.redrawStrokes();
    }

    changeAllStrokeWidth(newStrokeWidth: number): void {
        this.strokes.forEach((stroke: Stroke, uid: number) => (stroke.strokeWidth = newStrokeWidth));
    }

    changeAllStrokeColor(newColor: string): void {
        this.strokes.forEach((stroke: Stroke, uid: number) => (stroke.primaryColor = newColor));
    }

    changeAllStrokeOpacity(newOpacity: number): void {
        this.strokes.forEach((stroke: Stroke, uid: number) => (stroke.primaryOpacity = newOpacity));
    }

    updateSurface(): void {
        this.onUpdateSurfaceSource.next();
    }
}
