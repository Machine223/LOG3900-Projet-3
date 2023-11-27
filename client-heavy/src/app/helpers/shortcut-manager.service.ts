import { Injectable } from '@angular/core';
import { GridManagerService } from '../drawing/drawers/local-tools/grid/grid-manager.service';
import { UndoRedoService } from '../drawing/drawers/local-tools/undo-redo/undo-redo.service';
import { DrawingModeManagerService } from '../drawing/drawing-mode-manager.service';
import { ConstantsRepositoryService } from './constants-repository.service';

@Injectable({
    providedIn: 'root',
})
export class ShortcutManagerService {
    constructor(
        private constants: ConstantsRepositoryService,
        private drawingModeManager: DrawingModeManagerService,
        private gridManager: GridManagerService,
        private undoRedoService: UndoRedoService,
    ) {}

    private readonly DOWN_SHORTCUTS_ACTIONS: Map<string, () => void> = new Map<string, () => void>([
        // Tool change shortcuts
        [this.constants.C_KEY, () => this.drawingModeManager.setCurrentTool(this.constants.PENCIL_TOOL)],
        [this.constants.E_KEY, () => this.drawingModeManager.setCurrentTool(this.constants.ERASER_TOOL)],

        [this.constants.G_KEY, () => this.gridManager.toggleVisibility()],
    ]);

    private readonly DOWN_CTRL_SHORTCUTS_ACTIONS: Map<string, () => void> = new Map<string, () => void>([
        // Specific tool shortcuts
        [this.constants.Z_KEY, () => this.undoRedoService.undo()],
        [this.constants.Y_KEY, () => this.undoRedoService.redo()],
    ]);

    downKeyboardEvent(keyboardEvent: KeyboardEvent): void {
        if (keyboardEvent.ctrlKey) {
            this.onCtrlShortcut(keyboardEvent);
        } // else {
        // this.onOneKeyShortcut(keyboardEvent);
        // }
    }

    onCtrlShortcut(keyboardEvent: KeyboardEvent): void {
        const shortcutAction: (() => void) | undefined = this.DOWN_CTRL_SHORTCUTS_ACTIONS.get(keyboardEvent.key.toLowerCase());
        if (shortcutAction !== undefined) {
            keyboardEvent.preventDefault();
            shortcutAction();
        }
    }

    onOneKeyShortcut(keyboardEvent: KeyboardEvent): void {
        const key: string = keyboardEvent.key.length === 1 ? keyboardEvent.key.toLowerCase() : keyboardEvent.key;
        const shortcutAction: (() => void) | undefined = this.DOWN_SHORTCUTS_ACTIONS.get(key);
        if (shortcutAction !== undefined) {
            keyboardEvent.preventDefault();
            shortcutAction();
        }
    }
}
