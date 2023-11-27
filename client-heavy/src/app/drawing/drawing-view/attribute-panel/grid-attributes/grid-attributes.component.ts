import { Component } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { GridManagerService } from 'src/app/drawing/drawers/local-tools/grid/grid-manager.service';

@Component({
    selector: 'app-grid-attributes',
    templateUrl: './grid-attributes.component.html',
    styleUrls: ['./grid-attributes.component.scss'],
})
export class GridAttributesComponent {
    constructor(public gridManager: GridManagerService) {}

    toggleGridVisibility(event: MatSlideToggle): void {
        this.gridManager.setVisibility(event.checked);
    }

    inputSize(inputValue: number): void {
        this.gridManager.size = inputValue;
    }

    inputOpacity(inputValue: number): void {
        this.gridManager.opacity = inputValue;
    }
}
