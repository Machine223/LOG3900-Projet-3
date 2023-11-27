import { Injectable } from '@angular/core';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';

@Injectable({
    providedIn: 'root',
})
export class GridManagerService {
    size: number;
    opacity: number;
    isVisible: boolean;

    constructor(private constants: ConstantsRepositoryService) {
        this.opacity = 1;
        this.isVisible = false;
        this.size = constants.GRID_MAX_SQUARE_SIZE / 2;
    }

    toggleVisibility(): void {
        this.isVisible = !this.isVisible;
    }

    setVisibility(isActive: boolean): void {
        this.isVisible = isActive;
    }

    increaseSizeFromShortCut(): void {
        this.size % this.constants.GRID_SHORTCUT_INCREMENT === 0
            ? (this.size = Math.min(this.size + this.constants.GRID_SHORTCUT_INCREMENT, this.constants.GRID_MAX_SQUARE_SIZE))
            : (this.size = Math.min(
                  Math.ceil(this.size / this.constants.GRID_SHORTCUT_INCREMENT) * this.constants.GRID_SHORTCUT_INCREMENT,
                  this.constants.GRID_MAX_SQUARE_SIZE,
              ));
    }

    decreaseSizeFromShortCut(): void {
        this.size % this.constants.GRID_SHORTCUT_INCREMENT === 0
            ? (this.size = Math.max(this.size - this.constants.GRID_SHORTCUT_INCREMENT, this.constants.GRID_MIN_SQUARE_SIZE))
            : (this.size = Math.max(
                  Math.ceil(this.size / this.constants.GRID_SHORTCUT_INCREMENT - 1) * this.constants.GRID_SHORTCUT_INCREMENT,
                  this.constants.GRID_MIN_SQUARE_SIZE,
              ));
    }
}
