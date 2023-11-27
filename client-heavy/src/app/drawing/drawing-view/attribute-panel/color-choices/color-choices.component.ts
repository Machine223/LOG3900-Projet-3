import { Component, EventEmitter, Output } from '@angular/core';
import { ColorManagerService } from 'src/app/drawing/drawers/color/color-manager.service';
import { Rgba } from 'src/app/drawing/drawers/color/rgba';

@Component({
    selector: 'app-color-choices',
    templateUrl: './color-choices.component.html',
    styleUrls: ['./color-choices.component.scss'],
})
export class ColorChoicesComponent {
    @Output() presetChosen: EventEmitter<Rgba>;

    constructor(public colorService: ColorManagerService) {
        this.presetChosen = new EventEmitter<Rgba>();
    }

    onPresetChosen(newColor: Rgba): void {
        const newChosenColor = new Rgba();
        newChosenColor.copy(newColor, true);
        this.presetChosen.emit(newChosenColor);
    }
}
