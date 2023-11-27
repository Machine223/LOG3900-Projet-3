import { Component, EventEmitter, Output } from '@angular/core';
import { PairCreatorService } from '../../pair-creator.service';

@Component({
    selector: 'app-pair-generation',
    templateUrl: './pair-generation.component.html',
    styleUrls: ['./pair-generation.component.scss'],
})
export class PairGenerationComponent {
    @Output() creationFinished: EventEmitter<void>;

    constructor(public pairCreator: PairCreatorService) {
        this.creationFinished = new EventEmitter();
    }
}
