import { Component } from '@angular/core';
import { PencilToolService } from 'src/app/drawing/drawers/local-tools/drawing-tools/pencil-tool/pencil-tool.service';

@Component({
    selector: 'app-pencil-attributes',
    templateUrl: './pencil-attributes.component.html',
    styleUrls: ['./pencil-attributes.component.scss'],
})
export class PencilAttributesComponent {
    constructor(public pencilTool: PencilToolService) {}

    changeThickness(inputValue: number): void {
        this.pencilTool.setThickness(inputValue);
    }
}
