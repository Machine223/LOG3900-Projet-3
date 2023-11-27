import { Rectangle } from '../../../stroke/rectangle';

export class EraserShape {
    perimeter: Rectangle;
    isVisible: boolean;
    outlineWidth: number;
    primaryColor: string;

    constructor() {
        this.perimeter = new Rectangle();
        this.isVisible = true;
        this.outlineWidth = 2;
    }
}
