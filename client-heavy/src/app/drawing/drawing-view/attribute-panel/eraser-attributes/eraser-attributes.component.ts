import { Component } from '@angular/core';
import { EraserToolService } from 'src/app/drawing/drawers/local-tools/drawing-tools/eraser-tool/eraser-tool.service';
import { Subscriber } from 'src/app/helpers/subscriber';

@Component({
    selector: 'app-eraser-attributes',
    templateUrl: './eraser-attributes.component.html',
    styleUrls: ['./eraser-attributes.component.scss'],
})
export class EraserAttributesComponent extends Subscriber {
    constructor(public eraserTool: EraserToolService) {
        super();
    }

    changeSideLength(inputValue: number): void {
        this.eraserTool.setSideLength(inputValue);
    }
}
