import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConstantsRepositoryService } from '../helpers/constants-repository.service';
import { ToolSelectorService } from './drawers/tool-selector.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingModeManagerService {
    constructor(
        private constants: ConstantsRepositoryService,
        private toolSelector: ToolSelectorService,
    ) {
        this.toolSelector.setCurrentTool(this.constants.PENCIL_TOOL);
    }

    private currentToolSource = new BehaviorSubject<string>(this.constants.PENCIL_TOOL);
    currentTool = this.currentToolSource.asObservable();

    setCurrentTool(selectedTool: string): void {
        if (selectedTool === this.currentToolSource.value) {
            this.toolSelector.getCurrentTool().onPanelToggle();
        } else {
            this.currentToolSource.next(selectedTool);
            this.toolSelector.setCurrentTool(selectedTool);
        }
    }

    getCurrentTool(): string {
        return this.currentToolSource.value;
    }
}
