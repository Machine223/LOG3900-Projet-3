import { Subscriber } from 'src/app/helpers/subscriber';

export abstract class DrawingTool extends Subscriber {
    currentShapeId: number;

    constructor() {
        super();
    }
    /* tslint:disable:no-empty */
    onMouseUp(clickInfo: MouseEvent): void {}
    onMouseDown(clickInfo: MouseEvent): void {}
    onMouseMove(clickInfo: MouseEvent): void {}
    onMouseLeave(clickInfo: MouseEvent): void {}
    onWindowLeave(clickInfo: MouseEvent): void {}
    onBackgroundClick(clickInfo: MouseEvent): void {}
    onToolChange(): void {}
    onToolInitiate(): void {}
    onPanelToggle(): void {}
}
