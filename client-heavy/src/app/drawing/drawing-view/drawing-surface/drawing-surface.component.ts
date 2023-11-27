import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    HostListener,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { Subscriber } from 'src/app/helpers/subscriber';
import { ColorManagerService } from '../../drawers/color/color-manager.service';
import { Rgba } from '../../drawers/color/rgba';
import { EraserToolService } from '../../drawers/local-tools/drawing-tools/eraser-tool/eraser-tool.service';
import { EraserComponent } from '../../drawers/local-tools/drawing-tools/eraser-tool/eraser/eraser.component';
import { RedRectangleComponent } from '../../drawers/local-tools/drawing-tools/eraser-tool/red-rectangle/red-rectangle.component';
import { StrokeContainerService } from '../../drawers/stroke-container/stroke-container.service';
import { Stroke } from '../../drawers/stroke/stroke';
import { StrokeComponent } from '../../drawers/stroke/stroke-component/stroke.component';
import { ToolSelectorService } from '../../drawers/tool-selector.service';
import { DrawingSurfaceInfoService } from '../drawing-surface-info.service';
import { DrawingWindowInfoService } from '../drawing-window-info.service';
import { DrawingDirective } from './drawing-surface.directive';

const ERASABLE_CONTENT_RED_COLOR = '#ff0000';

@Component({
    selector: 'app-drawing-surface',
    templateUrl: './drawing-surface.component.html',
    styleUrls: ['./drawing-surface.component.scss'],
})
export class DrawingSurfaceComponent extends Subscriber implements OnInit, AfterViewInit {
    @Input() isEditable: boolean;

    @ViewChild(DrawingDirective, { static: true })
    drawingHost: DrawingDirective;
    @ViewChild('drawingSurface', { static: false }) drawingSurface: ElementRef<SVGSVGElement>;

    @ViewChild('eraserRectangle', { static: false })
    eraserRectangle: EraserComponent;
    @ViewChild('redRectangle', { static: false })
    redRectangle: RedRectangleComponent;

    drawingWidth: number;
    drawingHeight: number;
    drawingColor: Rgba;

    constructor(
        private toolSelector: ToolSelectorService,
        private shapeContainer: StrokeContainerService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private drawingInfoTracker: DrawingSurfaceInfoService,
        private constants: ConstantsRepositoryService,
        private colorService: ColorManagerService,
        private eraserTool: EraserToolService,
        private changeDetector: ChangeDetectorRef,
        private windowInfoTracker: DrawingWindowInfoService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.subscriptions.push(this.shapeContainer.lastId.subscribe((lastId) => this.loadComponent(lastId)));
        this.subscriptions.push(this.shapeContainer.onResetContainer.subscribe(() => this.drawingHost.viewContainerRef.clear()));
        this.subscriptions.push(this.shapeContainer.onRedrawStrokes.subscribe(() => this.redrawStrokes()));
        this.subscriptions.push(this.shapeContainer.onUpdateSurface.subscribe(() => this.changeDetector.detectChanges()));

        this.subscriptions.push(this.drawingInfoTracker.drawingHeight.subscribe((newHeight) => (this.drawingHeight = newHeight)));
        this.subscriptions.push(this.drawingInfoTracker.drawingWidth.subscribe((newWidth) => (this.drawingWidth = newWidth)));
        this.subscriptions.push(this.colorService.drawingSurfaceColor.subscribe((newColor) => (this.drawingColor = newColor)));
    }

    ngAfterViewInit(): void {
        this.eraserTool.setEraserRectangleChange(this.eraserRectangle.data);
        this.eraserTool.setRedRectangle(this.redRectangle.data);
        this.configureRedRectangle();
    }

    onMouseDown(event: MouseEvent): void {
        if (this.isEditable) {
            this.toolSelector.getCurrentTool().onMouseDown(event);
        }
    }

    onClick(event: MouseEvent): void {
        if (this.isEditable) {
            this.toolSelector.getCurrentTool().onBackgroundClick(event);
        }
    }

    loadComponent(uid: number): void {
        if (uid !== this.constants.INVALID_UID) {
            const shapeItem: Stroke = this.shapeContainer.getShape(uid);
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(StrokeComponent);
            const viewContainerRef = this.drawingHost.viewContainerRef;

            const componentRef = viewContainerRef.createComponent(componentFactory);
            componentRef.instance.data = shapeItem;
        }
    }

    cancelContextMenu(clickInfo: MouseEvent): void {
        clickInfo.preventDefault();
    }

    configureRedRectangle(): void {
        this.redRectangle.data.primaryColor = ERASABLE_CONTENT_RED_COLOR;
        this.redRectangle.data.outlineWidth = 1;
        this.changeDetector.detectChanges();
    }

    redrawStrokes(): void {
        const strokesUids: number[] = Array.from(this.shapeContainer.getShapes().keys());
        this.drawingHost.viewContainerRef.clear();
        strokesUids.forEach((uid: number) => this.loadComponent(uid));
    }

    onMouseUp(event: MouseEvent): void {
        if (this.isEditable) {
            this.toolSelector.getCurrentTool().onMouseUp(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isEditable) {
            this.toolSelector.getCurrentTool().onMouseMove(event);
        }
    }

    onScroll(scrollLeft: number, scrollTop: number): void {
        if (this.isEditable) {
            this.windowInfoTracker.setScroll(scrollLeft, scrollTop);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.isEditable) {
            this.toolSelector.getCurrentTool().onMouseLeave(event);
        }
    }

    @HostListener('window:mousemove', ['$event'])
    handleLastMouseMove(mouseMove: MouseEvent): void {
        if (this.isEditable) {
            this.windowInfoTracker.setLastMouseMove(mouseMove);
        }
    }
}
