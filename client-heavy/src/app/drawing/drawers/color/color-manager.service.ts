import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StrokeCommunicationsService } from 'src/app/game/communications/stroke-communications.service';
import { GameLocalStateService } from 'src/app/game/game-local-state.service';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { INetworkBackground } from './network-background';
import { Rgba } from './rgba';

const BLACK_COLOR_COMPONENT = '00';
const WHITE_COLOR_COMPONENT = 'ff';

@Injectable({
    providedIn: 'root',
})
export class ColorManagerService {
    private primaryColorSource = new BehaviorSubject<Rgba>(
        new Rgba(BLACK_COLOR_COMPONENT, BLACK_COLOR_COMPONENT, BLACK_COLOR_COMPONENT, 1),
    );
    primaryColor = this.primaryColorSource.asObservable();

    private drawingSurfaceColorSource = new BehaviorSubject<Rgba>(
        new Rgba(WHITE_COLOR_COMPONENT, WHITE_COLOR_COMPONENT, WHITE_COLOR_COMPONENT, 1),
    );
    drawingSurfaceColor = this.drawingSurfaceColorSource.asObservable();

    private recentlyUsedColors: Rgba[];
    colorChoices: Rgba[];
    gameroomName: string;

    constructor(
        public constants: ConstantsRepositoryService,
        private strokeCommunicationsService: StrokeCommunicationsService,
        private gameLocalStateService: GameLocalStateService,
    ) {
        this.recentlyUsedColors = [];
        this.setupColorChoices();
    }

    getDrawingSurfaceColorValue(): Rgba {
        return this.drawingSurfaceColorSource.value;
    }

    getPrimaryColorValue(): Rgba {
        return this.primaryColorSource.value;
    }

    changePrimaryColorValue(newColor: Rgba): void {
        const newPrimaryColor = new Rgba();
        newPrimaryColor.copy(newColor, true);
        this.primaryColorSource.next(newPrimaryColor);
    }

    changeDrawingSurfaceColorValue(newColor: Rgba): void {
        const newDrawingColor = new Rgba();
        newDrawingColor.copy(newColor, true);
        this.drawingSurfaceColorSource.next(newDrawingColor);

        if (this.gameLocalStateService.isEmitting) {
            const background: INetworkBackground = {
                gameroomName: this.gameroomName,
                color: newColor.rgbToHex(),
                opacity: newColor.a,
            };
            this.strokeCommunicationsService.emitBackgroundChange(background);
        }
    }

    addUsedColor(usedColor: Rgba): void {
        const usedColorToAdd: Rgba = new Rgba();
        usedColorToAdd.copy(usedColor, true);

        const isContainedInColorChoices = this.colorChoices.some((rgba: Rgba) => rgba.equalsTo(usedColor));
        const isContainedInUsedColors = this.recentlyUsedColors.some((rgba: Rgba) => rgba.equalsTo(usedColor));
        if (isContainedInColorChoices || isContainedInUsedColors) {
            return;
        }

        this.recentlyUsedColors.push(usedColorToAdd);
        if (this.recentlyUsedColors.length > this.constants.MAX_USED_COLORS) {
            this.recentlyUsedColors.shift();
        }
    }

    getRecentlyUsedColors(): Rgba[] {
        return this.recentlyUsedColors;
    }

    resetAll(): void {
        this.resetColors();
        while (this.recentlyUsedColors.length !== 0) {
            this.recentlyUsedColors.pop();
        }
    }

    private resetColors(): void {
        this.primaryColorSource.next(new Rgba(BLACK_COLOR_COMPONENT, BLACK_COLOR_COMPONENT, BLACK_COLOR_COMPONENT, 1));
        this.drawingSurfaceColorSource.next(new Rgba(WHITE_COLOR_COMPONENT, WHITE_COLOR_COMPONENT, WHITE_COLOR_COMPONENT, 1));
    }

    private setupColorChoices(): void {
        const black = new Rgba();
        black.setFromHex('#000000');
        const red = new Rgba();
        red.setFromHex('#FF0000');
        const orange = new Rgba();
        orange.setFromHex('#FFA500');
        const blue = new Rgba();
        blue.setFromHex('#0000FF');
        const yellow = new Rgba();
        yellow.setFromHex('#FFFF00');
        const grey = new Rgba();
        grey.setFromHex('#808080');
        const white = new Rgba();
        white.setFromHex('#FFFFFF');
        const green = new Rgba();
        green.setFromHex('#008000');
        const cyan = new Rgba();
        cyan.setFromHex('#00FFFF');
        const magenta = new Rgba();
        magenta.setFromHex('#FF00FF');

        this.colorChoices = [white, grey, black, blue, cyan, green, yellow, orange, red, magenta];
    }
}
