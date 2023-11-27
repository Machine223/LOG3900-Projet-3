import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ColorManagerService } from 'src/app/drawing/drawers/color/color-manager.service';
import { GridManagerService } from 'src/app/drawing/drawers/local-tools/grid/grid-manager.service';
import { StrokeContainerService } from 'src/app/drawing/drawers/stroke-container/stroke-container.service';
import { DrawingModeManagerService } from 'src/app/drawing/drawing-mode-manager.service';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { PairCreatorService } from 'src/app/word-image-pair/pair-creator.service';

@Component({
    selector: 'app-manual-generation',
    templateUrl: './manual-generation.component.html',
    styleUrls: ['./manual-generation.component.scss'],
})
export class ManualGenerationComponent implements AfterViewInit, OnDestroy {
    @Input() isEdit: boolean;
    @Output() creationFinished: EventEmitter<void>;
    constructor(
        private strokeContainer: StrokeContainerService,
        private pairCreator: PairCreatorService,
        private changeDetector: ChangeDetectorRef,
        private colorManager: ColorManagerService,
        private gridManager: GridManagerService,
        private modeManager: DrawingModeManagerService,
        private constants: ConstantsRepositoryService,
    ) {
        this.creationFinished = new EventEmitter();
    }

    ngAfterViewInit(): void {
        this.modeManager.setCurrentTool(this.constants.PENCIL_TOOL);
        this.gridManager.setVisibility(false);
        if (this.isEdit) {
            this.pairCreator.resetContainerWithSavedDrawing();
            this.changeDetector.detectChanges();
        } else {
            this.strokeContainer.resetContainer();
            this.colorManager.resetAll();
            this.changeDetector.detectChanges();
        }
    }

    saveDrawing(): void {
        this.pairCreator.saveDrawing();
        this.creationFinished.emit();
    }

    cancelDrawing(): void {
        this.creationFinished.emit();
    }

    ngOnDestroy(): void {
        this.modeManager.setCurrentTool(this.constants.PENCIL_TOOL);
        this.gridManager.setVisibility(false);
    }
}
