import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { PairCreatorService } from 'src/app/word-image-pair/pair-creator.service';
import { ImageConverterService } from './image-converter.service';

@Component({
    selector: 'app-converter-process',
    templateUrl: './converter-process.component.html',
    styleUrls: ['./converter-process.component.scss'],
})
export class ConverterProcessComponent {
    @Output() creationFinished: EventEmitter<void>;
    @ViewChild('stepper') stepper: MatStepper;
    constructor(public pairCreator: PairCreatorService, public imageConverter: ImageConverterService) {
        this.creationFinished = new EventEmitter();
    }
    startConversion(): void {
        this.imageConverter.isConverting = true;
        setTimeout(() => {
            this.stepper.next();
            this.pairCreator.convertImage();
        }, 0);
    }

    saveDrawing(): void {
        this.pairCreator.saveDrawing();
        this.creationFinished.emit();
    }

    exit(): void {
        this.pairCreator.resetSavedBase64Images();
        this.creationFinished.emit();
    }
}
