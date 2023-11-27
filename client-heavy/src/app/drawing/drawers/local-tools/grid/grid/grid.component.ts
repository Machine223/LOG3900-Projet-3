import { Component } from '@angular/core';
import { DrawingSurfaceInfoService } from 'src/app/drawing/drawing-view/drawing-surface-info.service';
import { Subscriber } from 'src/app/helpers/subscriber';
import { GridManagerService } from '../grid-manager.service';

@Component({
    /* tslint:disable */
    selector: '[app-grid]',
    /* tslint:enable */
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
})
export class GridComponent extends Subscriber {
    data: GridManagerService;
    height: number;
    width: number;

    constructor(gridManager: GridManagerService, drawingInfo: DrawingSurfaceInfoService) {
        super();
        this.data = gridManager;
        this.height = drawingInfo.getHeight();
        this.width = drawingInfo.getWidth();

        this.subscriptions.push(drawingInfo.drawingHeight.subscribe((newHeight) => (this.height = newHeight)));
        this.subscriptions.push(drawingInfo.drawingWidth.subscribe((newWidth) => (this.width = newWidth)));
    }
}
