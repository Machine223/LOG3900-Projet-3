import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';

import { Rgba } from 'src/app/drawing/drawers/color/rgba';
import { Point } from 'src/app/drawing/drawers/stroke/point';

const DRAWING_START = new Point(0, 0);
const GRADIENT_END = new Point(0, 0);
const EXTRACTION_X = 1;
const EXTRACTION_Y = 1;
const OPACITY_MAXIMUM = 255;
const OPAQUE_WHITE = 'rgba(255,255,255,1)';
const TRANSPARENT_WHITE = 'rgba(255,255,255,0)';
const OPAQUE_BLACK = 'rgba(0,0,0,1)';
const TRANSPARENT_BLACK = 'rgba(0,0,0,0)';

@Component({
    selector: 'app-colors-canvas',
    templateUrl: './colors-canvas.component.html',
    styleUrls: ['./colors-canvas.component.scss'],
})
export class ColorsCanvasComponent implements AfterViewInit, OnChanges {
    private sideCanvasContext: CanvasRenderingContext2D;
    private mainCanvasContext: CanvasRenderingContext2D;
    private selectorWidth: number;
    private selectorHeight: number;

    isMainSelectorDragging: boolean;
    isSideSelectorDragging: boolean;
    isMainSelectorFocused: boolean;
    isSideSelectorFocused: boolean;

    @Input() primaryColor: Rgba;
    @Output() chosenColor: EventEmitter<Rgba> = new EventEmitter<Rgba>();

    @ViewChild('mainColorSelector', { static: false })
    mainColorSelector: ElementRef<HTMLCanvasElement>;
    @ViewChild('sideColorSelector', { static: false })
    sideColorSelector: ElementRef<HTMLCanvasElement>;

    ngAfterViewInit(): void {
        const image: HTMLImageElement = new Image();
        image.src = 'assets/rectPicker.png';
        this.sideCanvasContext = this.sideColorSelector.nativeElement.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
        image.onload = () => {
            this.sideCanvasContext.drawImage(image, DRAWING_START.x, DRAWING_START.y);
        };
        this.mainCanvasContext = this.mainColorSelector.nativeElement.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
        this.drawMainSelector();
    }

    constructor() {
        this.primaryColor = new Rgba();
        this.selectorWidth = 0;
        this.selectorHeight = 0;

        this.isMainSelectorDragging = false;
        this.isSideSelectorDragging = false;
        this.isMainSelectorFocused = false;
        this.isSideSelectorFocused = false;
    }

    ngOnChanges(): void {
        if (this.mainColorSelector) {
            this.drawMainSelector();
        }
    }

    onMainSelectorMouseMove(event: MouseEvent): void {
        if (this.isMainSelectorDragging) {
            this.onMainChange(event);
        }
    }

    onSideSelectorMouseMove(event: MouseEvent): void {
        if (this.isSideSelectorDragging) {
            this.onSideChange(event);
        }
    }

    onMainSelectorMouseUp(event: MouseEvent): void {
        if (this.isMainSelectorFocused) {
            this.onMainChange(event);
        }
    }

    onSideSelectorMouseUp(event: MouseEvent): void {
        if (this.isSideSelectorFocused) {
            this.onSideChange(event);
        }
    }

    onMainChange(event: MouseEvent): void {
        const mainSelectorWidth = this.mainColorSelector.nativeElement.width;
        const mainSelectorHeight = this.mainColorSelector.nativeElement.height;
        if (event.offsetX >= 0 && event.offsetY >= 0 && event.offsetX <= mainSelectorWidth - 1 && event.offsetY <= mainSelectorHeight - 1) {
            this.chosenColor.emit(this.extractMainColor(event));
        }
    }

    onSideChange(event: MouseEvent): void {
        const sideSelectorWidth = this.sideColorSelector.nativeElement.width;
        const sideSelectorHeight = this.sideColorSelector.nativeElement.height;
        if (event.offsetX >= 0 && event.offsetY >= 0 && event.offsetX <= sideSelectorWidth - 1 && event.offsetY <= sideSelectorHeight - 1) {
            this.primaryColor = this.extractSideColor(event);
            this.chosenColor.emit(this.primaryColor);
            this.drawMainSelector();
        }
    }

    drawMainSelector(): void {
        this.selectorWidth = this.mainColorSelector.nativeElement.width;
        this.selectorHeight = this.mainColorSelector.nativeElement.height;
        this.mainCanvasContext.clearRect(DRAWING_START.x, DRAWING_START.y, this.selectorWidth, this.selectorHeight);

        // Current color as background
        this.mainCanvasContext.fillStyle = this.primaryColor.rgbToHex();
        this.mainCanvasContext.fillRect(DRAWING_START.x, DRAWING_START.y, this.selectorWidth, this.selectorHeight);

        this.drawWhiteGradient();
        this.drawBlackGradient();
    }

    private drawWhiteGradient(): void {
        // White gradient diminishing opacity from left to right
        const firstGradient = this.mainCanvasContext.createLinearGradient(
            DRAWING_START.x,
            DRAWING_START.y,
            this.selectorWidth,
            GRADIENT_END.y,
        );
        firstGradient.addColorStop(0, OPAQUE_WHITE);
        firstGradient.addColorStop(1, TRANSPARENT_WHITE);

        this.mainCanvasContext.fillStyle = firstGradient;
        this.mainCanvasContext.fillRect(DRAWING_START.x, DRAWING_START.y, this.selectorWidth, this.selectorHeight);
    }

    private drawBlackGradient(): void {
        // Black gradient diminishing opacity from bottom to top
        const secondGradient = this.mainCanvasContext.createLinearGradient(
            DRAWING_START.x,
            DRAWING_START.y,
            GRADIENT_END.x,
            this.selectorHeight,
        );
        secondGradient.addColorStop(0, TRANSPARENT_BLACK);
        secondGradient.addColorStop(1, OPAQUE_BLACK);

        this.mainCanvasContext.fillStyle = secondGradient;
        this.mainCanvasContext.fillRect(DRAWING_START.x, DRAWING_START.y, this.selectorWidth, this.selectorHeight);
    }

    extractMainColor(event: MouseEvent): Rgba {
        const offsetX = event.offsetX;
        const offsetY = event.offsetY;
        const pixel = this.mainCanvasContext.getImageData(offsetX, offsetY, EXTRACTION_X, EXTRACTION_Y);
        return this.pixelToRgba(pixel.data);
    }

    extractSideColor(event: MouseEvent): Rgba {
        const offsetX = event.offsetX;
        const offsetY = event.offsetY;
        const pixel = this.sideCanvasContext.getImageData(offsetX, offsetY, EXTRACTION_X, EXTRACTION_Y);
        return this.pixelToRgba(pixel.data);
    }

    pixelToRgba(pixel: Uint8ClampedArray): Rgba {
        const rgbaFromPixel = new Rgba();
        rgbaFromPixel.setFromDecimal(pixel[0], pixel[1], pixel[2], pixel[3] / OPACITY_MAXIMUM);
        return rgbaFromPixel;
    }
}
