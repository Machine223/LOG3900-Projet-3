import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ColorManagerService } from 'src/app/drawing/drawers/color/color-manager.service';
import { Rgba } from 'src/app/drawing/drawers/color/rgba';
import { StrokeContainerService } from 'src/app/drawing/drawers/stroke-container/stroke-container.service';
import { Subscriber } from 'src/app/helpers/subscriber';
import { PairCreatorService } from 'src/app/word-image-pair/pair-creator.service';
import { QuickdrawManagerService } from './quickdraw-manager.service';

@Component({
    selector: 'app-quick-draw-generation',
    templateUrl: './quick-draw-generation.component.html',
    styleUrls: ['./quick-draw-generation.component.scss'],
})
export class QuickDrawGenerationComponent extends Subscriber implements OnInit {
    @Output() creationFinished: EventEmitter<void>;

    drawingSurfaceColor: Rgba;
    recentlyUsedColors: Rgba[];

    get primaryColor(): Rgba {
        return Rgba.fromHexAndOpacity(this.quickDrawManager.strokeColor, this.quickDrawManager.opacity);
    }

    constructor(
        public quickDrawManager: QuickdrawManagerService,
        private strokeContainer: StrokeContainerService,
        private colorManager: ColorManagerService,
        private pairCreator: PairCreatorService,
    ) {
        super();
        this.creationFinished = new EventEmitter();
    }

    ngOnInit(): void {
        this.strokeContainer.resetContainer();
        this.colorManager.resetAll();
        this.quickDrawManager.resetValues();
        this.subscriptions.push(
            this.colorManager.drawingSurfaceColor.subscribe(
                (newDrawingSurfaceColor) => (this.drawingSurfaceColor = newDrawingSurfaceColor),
            ),
        );

        this.drawingSurfaceColor = this.colorManager.getDrawingSurfaceColorValue();
        this.recentlyUsedColors = this.colorManager.getRecentlyUsedColors();
        setTimeout(() => {
            this.quickDrawManager.drawCurrent();
            this.quickDrawManager.sawTheFirst();
        }, 0);
    }

    onStrokeColorChange(newColor: Rgba): void {
        this.quickDrawManager.strokeColor = newColor.rgbToHex();
        this.quickDrawManager.opacity = newColor.a;
        this.quickDrawManager.updateStrokeColor();
        this.quickDrawManager.updateOpacity();
        this.colorManager.addUsedColor(newColor);
    }

    onDrawingSurfaceColorChange(newColor: Rgba): void {
        const newDrawingSurfaceColor = new Rgba();
        const oldDrawingSurfaceColor = new Rgba();
        newDrawingSurfaceColor.copy(newColor, true);
        oldDrawingSurfaceColor.copy(this.colorManager.getDrawingSurfaceColorValue(), true);

        if (!oldDrawingSurfaceColor.equalsTo(newDrawingSurfaceColor)) {
            this.colorManager.changeDrawingSurfaceColorValue(newColor);
            this.colorManager.addUsedColor(newColor);
        }
    }

    strokeWidthChanged(): void {
        this.quickDrawManager.updateStrokeWidth();
    }

    nextAsked(): void {
        this.quickDrawManager.drawNext();
    }

    previousAsked(): void {
        this.quickDrawManager.drawPrevious();
    }

    cancelClicked(): void {
        this.quickDrawManager.flushSeenDrawings();
        this.creationFinished.emit();
    }

    saveClicked(): void {
        this.pairCreator.saveDrawing();
        this.pairCreator.word = this.quickDrawManager.currentTitle;
        this.quickDrawManager.flushSeenDrawings();
        this.creationFinished.emit();
    }
}
