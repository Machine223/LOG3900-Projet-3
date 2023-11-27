import { Component, HostListener } from '@angular/core';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { ShortcutManagerService } from 'src/app/helpers/shortcut-manager.service';
import { Subscriber } from 'src/app/helpers/subscriber';
import { ToolSelectorService } from '../../drawers/tool-selector.service';

@Component({
    selector: 'app-drawing-panel',
    templateUrl: './drawing-panel.component.html',
    styleUrls: ['./drawing-panel.component.scss'],
})
export class DrawingPanelComponent extends Subscriber {
    showPanel: boolean;
    constructor(
        private toolSelector: ToolSelectorService,
        private constants: ConstantsRepositoryService,
        private shortcutManager: ShortcutManagerService,
    ) {
        super();
    }

    onMouseUp(event: MouseEvent): void {
        this.toolSelector.getCurrentTool().onMouseUp(event);
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyDownEvent(keyboardEvent: KeyboardEvent): void {
        if (
            !keyboardEvent.repeat ||
            keyboardEvent.key.toLowerCase() === this.constants.Z_KEY ||
            keyboardEvent.key.toLowerCase() === this.constants.Y_KEY
        ) {
            this.shortcutManager.downKeyboardEvent(keyboardEvent);
        }
    }
}
