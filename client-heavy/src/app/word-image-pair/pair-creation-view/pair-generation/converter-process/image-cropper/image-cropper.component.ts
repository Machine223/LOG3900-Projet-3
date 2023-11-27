import { Component, Input } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { PairCreatorService } from 'src/app/word-image-pair/pair-creator.service';
import { ImageConverterService } from '../image-converter.service';

@Component({
    selector: 'app-image-cropper',
    templateUrl: './image-cropper.component.html',
    styleUrls: ['./image-cropper.component.scss'],
})
export class ImageCropperComponent {
    @Input() base64Image: string;

    constructor(public pairCreator: PairCreatorService, private imageConverter: ImageConverterService) {}

    imageCropped(event: ImageCroppedEvent): void {
        this.pairCreator.base64CroppedImage = event.base64;
        this.imageConverter.resetValues();
    }
}
