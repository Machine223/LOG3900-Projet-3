import { Component, OnInit } from '@angular/core';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { IconRepositoryService } from 'src/app/helpers/icon-repository.service';
import { Subscriber } from 'src/app/helpers/subscriber';
import { UndoRedoService } from '../../drawers/local-tools/undo-redo/undo-redo.service';
import { DrawingModeManagerService } from '../../drawing-mode-manager.service';
import { IButtonInfo } from './button-info';

@Component({
    selector: 'app-lateral-bar',
    templateUrl: './lateral-bar.component.html',
    styleUrls: ['./lateral-bar.component.scss'],
})
export class LateralBarComponent extends Subscriber implements OnInit {
    currentTool: string;
    toolButtons: IButtonInfo[] = [
        {
            name: this.constants.PENCIL_TOOL,
            imageUrl: this.iconRepository.getIcon(this.constants.PENCIL_TOOL),
        },
        {
            name: this.constants.ERASER_TOOL,
            imageUrl: this.iconRepository.getIcon(this.constants.ERASER_TOOL),
        },
        {
            name: this.constants.GRID_TOOL,
            imageUrl: this.iconRepository.getIcon(this.constants.GRID_TOOL),
        },
    ] as IButtonInfo[];

    undoRedoButtons: IButtonInfo[] = [
        {
            name: this.constants.UNDO_TOOL,
            imageUrl: this.iconRepository.getIcon(this.constants.UNDO_TOOL),
        },
        {
            name: this.constants.REDO_TOOL,
            imageUrl: this.iconRepository.getIcon(this.constants.REDO_TOOL),
        },
    ] as IButtonInfo[];

    constructor(
        private modeManager: DrawingModeManagerService,
        private iconRepository: IconRepositoryService,
        private constants: ConstantsRepositoryService,
        public undoRedoService: UndoRedoService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.currentTool = this.modeManager.getCurrentTool();
        this.subscriptions.push(this.modeManager.currentTool.subscribe((selectedTool) => (this.currentTool = selectedTool)));
    }

    toolSelected(buttonName: string): void {
        this.modeManager.setCurrentTool(buttonName);
    }

    undo(): void {
        this.undoRedoService.undo();
    }

    redo(): void {
        this.undoRedoService.redo();
    }
}
