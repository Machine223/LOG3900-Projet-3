import { Injectable } from '@angular/core';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { Point } from '../drawers/stroke/point';

@Injectable({
    providedIn: 'root',
})
export class DrawingWindowInfoService {
    private scrollTop: number;
    private scrollLeft: number;
    private lastMouseMove: MouseEvent;

    constructor(private constants: ConstantsRepositoryService) {
        this.scrollLeft = constants.NULL_SCROLL;
        this.scrollTop = constants.NULL_SCROLL;
        this.lastMouseMove = new MouseEvent('click');
    }

    setScroll(scrollLeft: number, scrollTop: number): void {
        this.scrollTop = scrollTop;
        this.scrollLeft = scrollLeft;
    }

    setLastMouseMove(mouseMove: MouseEvent): void {
        this.lastMouseMove = mouseMove;
    }

    getLastMouseMove(): MouseEvent {
        return this.lastMouseMove;
    }

    calculateOffsetX(): number {
        return this.constants.LATERAL_BAR_WIDTH - this.constants.PANEL_WIDTH - this.scrollLeft;
    }

    calculateOffsetY(): number {
        return this.scrollTop;
    }

    getMousePositionWithOffset(mouseInfo: MouseEvent): Point {
        return new Point(mouseInfo.offsetX, mouseInfo.offsetY);
    }
}
