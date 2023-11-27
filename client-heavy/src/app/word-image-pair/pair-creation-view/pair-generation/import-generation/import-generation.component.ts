import { Component } from '@angular/core';
import { AlertService } from 'src/app/pop-up/alert/alert.service';
import { PairCreatorService } from 'src/app/word-image-pair/pair-creator.service';

@Component({
    selector: 'app-import-generation',
    templateUrl: './import-generation.component.html',
    styleUrls: ['./import-generation.component.scss'],
})
export class ImportGenerationComponent {
    constructor(public pairCreator: PairCreatorService, private alertService: AlertService) {}

    selectFile(event): void {
        const rawFile = event.target.files[0];

        if (!rawFile || rawFile.length === 0) {
            const title = 'Error';
            const content = 'There was a problem with that file, try another one';
            this.alertService.alertError(title, content);
            return;
        }

        const mimeType = rawFile.type;
        if (mimeType.match(/image\/*/) === null) {
            const title = 'Wrong file type';
            const content = 'Only image files are accepted';
            this.alertService.alertError(title, content);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(rawFile);

        reader.onload = () => {
            this.pairCreator.base64Image = reader.result.toString();
        };
    }
}
