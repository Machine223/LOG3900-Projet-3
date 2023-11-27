import { Component, Input } from '@angular/core';
import { EraserShape } from '../eraser-shape';

@Component({
    /* tslint:disable */
    selector: 'svg[app-eraser]',
    /* tslint:enable */
    templateUrl: './eraser.component.html',
    styleUrls: ['./eraser.component.scss'],
})
export class EraserComponent {
    @Input() data: EraserShape;

    constructor() {
        this.data = new EraserShape();
    }
}
