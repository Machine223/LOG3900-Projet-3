import { Component, OnInit } from '@angular/core';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { Subscriber } from 'src/app/helpers/subscriber';
import { DrawingModeManagerService } from '../../drawing-mode-manager.service';

@Component({
    selector: 'app-attribute-panel',
    templateUrl: './attribute-panel.component.html',
    styleUrls: ['./attribute-panel.component.scss'],
})
export class AttributePanelComponent extends Subscriber implements OnInit {
    currentMode: string;
    constructor(private modeManager: DrawingModeManagerService, public constants: ConstantsRepositoryService) {
        super();
    }

    ngOnInit(): void {
        this.subscriptions.push(this.modeManager.currentTool.subscribe((currentMode) => (this.currentMode = currentMode)));
    }
}
