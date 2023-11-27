import { Injectable } from '@angular/core';
import { ConstantsRepositoryService } from './constants-repository.service';

@Injectable({
    providedIn: 'root',
})
export class IconRepositoryService {
    constructor(private constants: ConstantsRepositoryService) {}

    private iconPathMap: Map<string, string> = new Map([
        [this.constants.PENCIL_TOOL, 'create'],
        [this.constants.ERASER_TOOL, 'clear'],
        [this.constants.UNDO_TOOL, 'undo'],
        [this.constants.REDO_TOOL, 'redo'],
        [this.constants.GRID_TOOL, 'grid_on'],
        [this.constants.UNDEFINED_ICON_NAME, 'error'],
    ]);

    getIcon(iconName: string): string {
        return (this.iconPathMap.get(iconName) as string) || (this.iconPathMap.get(this.constants.UNDEFINED_ICON_NAME) as string);
    }
}
