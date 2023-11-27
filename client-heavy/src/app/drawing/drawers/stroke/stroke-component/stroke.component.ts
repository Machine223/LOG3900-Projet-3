import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Subscriber } from 'src/app/helpers/subscriber';
import { EraserToolService } from '../../local-tools/drawing-tools/eraser-tool/eraser-tool.service';
import { ToolSelectorService } from '../../tool-selector.service';
import { Rectangle } from '../rectangle';
import { Stroke } from '../stroke';

@Component({
    /* tslint:disable */
    selector: 'svg[app-stroke]',
    /* tslint:enable */
    templateUrl: './stroke.component.html',
    styleUrls: ['./stroke.component.scss'],
})
export class StrokeComponent extends Subscriber implements AfterViewInit {
    @Input() data: Stroke;
    @ViewChild('shape', { static: false }) shapeReference: ElementRef<SVGSVGElement>;

    constructor(public toolSelector: ToolSelectorService, public eraserTool: EraserToolService, public changeDetector: ChangeDetectorRef) {
        super();
        this.data = new Stroke();
    }
    ngAfterViewInit(): void {
        this.data.setShapeReference(this.shapeReference.nativeElement);
        this.setUpEraserSubscription();
        this.data.detectChanges = () => this.changeDetector.detectChanges();
    }

    onClick(clickInfo: MouseEvent): void {
        clickInfo.preventDefault();
    }

    setUpEraserSubscription(): void {
        this.subscriptions.push(
            this.eraserTool.eraserRectangleChange.subscribe((eraserRectangle: Rectangle) => {
                if (this.data.isVisible && this.data.isSelectable) {
                    this.changeDetector.detectChanges();
                    const boundingRectangle: Rectangle = this.data.getBoundingRectangle();
                    if (boundingRectangle.isIntersecting(eraserRectangle)) {
                        this.eraserTool.putShapeInEraseArea(this.data.uid);
                    }
                }
            }),
        );
    }

    onMouseDown(clickInfo: MouseEvent): void {
        clickInfo.preventDefault();
    }
}
