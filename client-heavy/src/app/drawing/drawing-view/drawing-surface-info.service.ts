import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const INITIAL_WIDTH = 700;
const INITIAL_HEIGHT = 700;
@Injectable({
    providedIn: 'root',
})
export class DrawingSurfaceInfoService {
    private drawingWidthSource = new BehaviorSubject<number>(INITIAL_WIDTH);
    drawingWidth = this.drawingWidthSource.asObservable();

    private drawingHeightSource = new BehaviorSubject<number>(INITIAL_HEIGHT);
    drawingHeight = this.drawingHeightSource.asObservable();

    constructor() {}

    setWidth(width: number): void {
        this.drawingWidthSource.next(width);
    }

    getWidth(): number {
        return this.drawingWidthSource.value;
    }

    setHeight(height: number): void {
        this.drawingHeightSource.next(height);
    }

    getHeight(): number {
        return this.drawingHeightSource.value;
    }
}
