import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { VirtualDrawerService } from 'src/app/drawing/drawers/virtual-drawer/virtual-drawer.service';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { PairCreatorService } from '../../pair-creator.service';

@Component({
    selector: 'app-pair-preview',
    templateUrl: './pair-preview.component.html',
    styleUrls: ['./pair-preview.component.scss'],
})
export class PairPreviewComponent implements OnDestroy {
    @Output() wantsExit: EventEmitter<void>;

    constructor(
        public virtualDrawer: VirtualDrawerService,
        private pairCreator: PairCreatorService,
        private constants: ConstantsRepositoryService,
    ) {
        this.wantsExit = new EventEmitter();
        this.pairCreator.prepareVirtualDrawer();
    }

    startPreview(): void {
        if (this.virtualDrawer.currentPair.isRandom) {
            this.pairCreator.randomizeCoordinates();
        }
        this.virtualDrawer.startDrawing(this.constants.PREVIEW_DELAY);
    }

    stopPreview(): void {
        this.virtualDrawer.stopDrawing();
    }

    backToPairInformation(): void {
        this.wantsExit.emit();
    }

    ngOnDestroy(): void {
        this.virtualDrawer.stopDrawing();
    }
}
