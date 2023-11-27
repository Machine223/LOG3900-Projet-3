import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Rgba } from 'src/app/drawing/drawers/color/rgba';

const DISPLAY_DURATION = 250;
const HEXADECIMAL_VALIDATOR: Validators = [Validators.required, Validators.maxLength(2), Validators.pattern('[0-9A-Fa-f]{1,2}')];

@Component({
    selector: 'app-color-tool',
    templateUrl: './color-tool.component.html',
    styleUrls: ['./color-tool.component.scss'],
})
export class ColorToolComponent implements OnInit {
    temporaryColor: Rgba;
    userRgb: FormGroup;
    showDropDown: boolean;
    canvasMainColor: Rgba;

    timerId: number;

    showCustom: boolean;

    @Input() currentlySelectedColor: Rgba;
    @Input() recentlyUsedColors: Rgba[];
    @Output() colorChanged = new EventEmitter<Rgba>();

    constructor() {
        this.temporaryColor = new Rgba();
        this.canvasMainColor = new Rgba();
        this.currentlySelectedColor = new Rgba();
        this.recentlyUsedColors = [];
        this.showCustom = false;
    }

    ngOnInit(): void {
        this.temporaryColor.copy(this.currentlySelectedColor, true);
        this.canvasMainColor.copy(this.currentlySelectedColor, false);
        this.showDropDown = false;
        this.initializeForm();
    }

    initializeForm(): void {
        this.userRgb = new FormGroup({
            rValue: new FormControl(this.temporaryColor.r, HEXADECIMAL_VALIDATOR),
            gValue: new FormControl(this.temporaryColor.g, HEXADECIMAL_VALIDATOR),
            bValue: new FormControl(this.temporaryColor.b, HEXADECIMAL_VALIDATOR),
        });
    }

    onNewColor(newColor: Rgba): void {
        this.temporaryColor.copy(newColor, true);
    }

    getTemporaryColor(): string {
        return this.temporaryColor.getStyle();
    }

    timeClosing(): void {
        if (this.showDropDown) {
            this.timerId = window.setTimeout(() => {
                this.onSubmit();
            }, DISPLAY_DURATION);
        }
    }

    onSubmit(): void {
        if (!this.userRgb.invalid) {
            this.colorChanged.emit(this.temporaryColor);
        }

        this.closePicker();
    }

    preventClosing(): void {
        window.clearTimeout(this.timerId);
    }

    openPicker(): void {
        this.showCustom = false;
        this.showDropDown = true;
        this.temporaryColor.copy(this.currentlySelectedColor, true);
        this.canvasMainColor.copy(this.currentlySelectedColor, false);
    }

    closePicker(): void {
        this.showDropDown = false;
    }

    onKeyPress(event: KeyboardEvent): void {
        event.stopImmediatePropagation();
    }

    onQuickColorSelected(chosenColor: Rgba): void {
        this.temporaryColor.copy(chosenColor, true);
        const newCanvasMainColor = new Rgba();
        newCanvasMainColor.copy(chosenColor, false);
        this.canvasMainColor = newCanvasMainColor;
        this.onSubmit();
    }

    togglePicker(): void {
        this.showDropDown ? this.closePicker() : this.openPicker();
    }

    wantsCustom(): void {
        const newCanvasMainColor = new Rgba();
        newCanvasMainColor.copy(this.temporaryColor, false);
        this.canvasMainColor = newCanvasMainColor;
        this.showCustom = true;
    }

    wantsPreset(): void {
        this.showCustom = false;
    }
}
