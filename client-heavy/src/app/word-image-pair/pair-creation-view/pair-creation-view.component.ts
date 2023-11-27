import { Component, EventEmitter, Output } from '@angular/core';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';

@Component({
    selector: 'app-pair-creation-view',
    templateUrl: './pair-creation-view.component.html',
    styleUrls: ['./pair-creation-view.component.scss'],
})
export class PairCreationViewComponent {
    @Output() newNavigation: EventEmitter<string>;
    currentMode: string;
    constructor(public constants: ConstantsRepositoryService) {
        this.newNavigation = new EventEmitter();
        this.currentMode = this.constants.INFORMATION_MODE;
    }

    returnToMenu(): void {
        this.newNavigation.emit(this.constants.MAIN_MENU);
    }
}
