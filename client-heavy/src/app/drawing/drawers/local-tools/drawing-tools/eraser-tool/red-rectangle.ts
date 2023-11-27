import { Rectangle } from '../../../stroke/rectangle';

export class RedRectangle {
    outlineWidth: number;
    primaryColor: string;

    perimeter: Rectangle;
    isVisible: boolean;

    constructor() {
        this.perimeter = new Rectangle();
        this.isVisible = true;
    }
}
