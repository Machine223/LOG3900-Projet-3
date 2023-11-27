import { Component, OnInit } from '@angular/core';
import { ColorManagerService } from 'src/app/drawing/drawers/color/color-manager.service';
import { Rgba } from 'src/app/drawing/drawers/color/rgba';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { Subscriber } from 'src/app/helpers/subscriber';
import { PairCreatorService } from 'src/app/word-image-pair/pair-creator.service';
import { ImageConverterService } from '../image-converter.service';

@Component({
    selector: 'app-conversion-view',
    templateUrl: './conversion-view.component.html',
    styleUrls: ['./conversion-view.component.scss'],
})
export class ConversionViewComponent extends Subscriber implements OnInit {
    drawingSurfaceColor: Rgba;
    recentlyUsedColors: Rgba[];

    constructor(
        public pairCreator: PairCreatorService,
        public imageConverter: ImageConverterService,
        public constants: ConstantsRepositoryService,
        private colorService: ColorManagerService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this.colorService.drawingSurfaceColor.subscribe(
                (newDrawingSurfaceColor) => (this.drawingSurfaceColor = newDrawingSurfaceColor),
            ),
        );

        this.drawingSurfaceColor = this.colorService.getDrawingSurfaceColorValue();
        this.recentlyUsedColors = this.colorService.getRecentlyUsedColors();
    }

    get primaryColor(): Rgba {
        return Rgba.fromHexAndOpacity(this.imageConverter.strokeColor, this.imageConverter.opacity);
    }

    onStrokeColorChange(newColor: Rgba): void {
        this.imageConverter.strokeColor = newColor.rgbToHex();
        this.imageConverter.opacity = newColor.a;
        this.imageConverter.updateStrokeColor();
        this.imageConverter.updateOpacity();
        this.colorService.addUsedColor(newColor);
    }

    onDrawingSurfaceColorChange(newColor: Rgba): void {
        const newDrawingSurfaceColor = new Rgba();
        const oldDrawingSurfaceColor = new Rgba();
        newDrawingSurfaceColor.copy(newColor, true);
        oldDrawingSurfaceColor.copy(this.colorService.getDrawingSurfaceColorValue(), true);

        if (!oldDrawingSurfaceColor.equalsTo(newDrawingSurfaceColor)) {
            this.colorService.changeDrawingSurfaceColorValue(newColor);
            this.colorService.addUsedColor(newColor);
        }
    }

    minLengthChanged(): void {
        this.imageConverter.drawImage();
    }

    strokeWidthChanged(): void {
        this.imageConverter.updateStrokeWidth();
    }

    opacityChanged(): void {
        this.imageConverter.updateOpacity();
    }
}
