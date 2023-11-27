import { Injectable } from '@angular/core';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { DrawingTool } from './local-tools/drawing-tools/drawing-tool';
import { EraserToolService } from './local-tools/drawing-tools/eraser-tool/eraser-tool.service';
import { PencilToolService } from './local-tools/drawing-tools/pencil-tool/pencil-tool.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectorService {
    private tools: Map<string, DrawingTool>;
    private currentTool: DrawingTool;

    constructor(
        private constants: ConstantsRepositoryService,
        private pencilTool: PencilToolService,
        private eraserTool: EraserToolService,
    ) {
        this.tools = new Map<string, DrawingTool>([
            [this.constants.PENCIL_TOOL, this.pencilTool],
            [this.constants.ERASER_TOOL, this.eraserTool],
        ]);
    }

    setCurrentTool(toolName: string): void {
        if (this.currentTool !== undefined) {
            this.currentTool.onToolChange();
        }
        const currentTool: DrawingTool | undefined = this.tools.get(toolName);
        if (currentTool !== undefined) {
            this.currentTool = currentTool;
            this.currentTool.onToolInitiate();
        }
    }

    getCurrentTool(): DrawingTool {
        return this.currentTool;
    }
}
