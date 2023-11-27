import { Component, OnInit } from '@angular/core';
import { ColorManagerService } from 'src/app/drawing/drawers/color/color-manager.service';
import { Rgba } from 'src/app/drawing/drawers/color/rgba';
import { SingleAction } from 'src/app/drawing/drawers/local-tools/undo-redo/single-action';
import { UndoRedoService } from 'src/app/drawing/drawers/local-tools/undo-redo/undo-redo.service';
import { Subscriber } from 'src/app/helpers/subscriber';

@Component({
    selector: 'app-color-attributes',
    templateUrl: './color-attributes.component.html',
    styleUrls: ['./color-attributes.component.scss'],
})
export class ColorAttributesComponent extends Subscriber implements OnInit {
    primaryColor: Rgba;
    secondaryColor: Rgba;
    drawingSurfaceColor: Rgba;
    recentlyUsedColors: Rgba[];

    ngOnInit(): void {
        this.subscriptions.push(this.colorService.primaryColor.subscribe((newPrimaryColor) => (this.primaryColor = newPrimaryColor)));
        this.subscriptions.push(
            this.colorService.drawingSurfaceColor.subscribe(
                (newDrawingSurfaceColor) => (this.drawingSurfaceColor = newDrawingSurfaceColor),
            ),
        );

        this.primaryColor = this.colorService.getPrimaryColorValue();
        this.drawingSurfaceColor = this.colorService.getDrawingSurfaceColorValue();
        this.recentlyUsedColors = this.colorService.getRecentlyUsedColors();
    }

    constructor(public colorService: ColorManagerService, public undoRedoService: UndoRedoService) {
        super();
    }

    onPrimaryColorChange(newColor: Rgba): void {
        const newPrimaryColor = new Rgba();
        newPrimaryColor.copy(newColor, true);
        this.colorService.changePrimaryColorValue(newPrimaryColor);
        this.colorService.addUsedColor(newColor);
    }

    onDrawingSurfaceColorChange(newColor: Rgba): void {
        const newDrawingSurfaceColor = new Rgba();
        const oldDrawingSurfaceColor = new Rgba();
        newDrawingSurfaceColor.copy(newColor, true);
        oldDrawingSurfaceColor.copy(this.colorService.getDrawingSurfaceColorValue(), true);

        if (!oldDrawingSurfaceColor.equalsTo(newDrawingSurfaceColor)) {
            this.colorService.changeDrawingSurfaceColorValue(newColor);
            this.colorService.addUsedColor(newColor);
            const newAction = new SingleAction();
            newAction.undo = () => {
                this.colorService.changeDrawingSurfaceColorValue(oldDrawingSurfaceColor);
            };
            newAction.redo = () => {
                this.colorService.changeDrawingSurfaceColorValue(newDrawingSurfaceColor);
            };
            this.undoRedoService.addNewAction(newAction);
        }
    }
}
