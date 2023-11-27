import { Point } from './point';

const INVALID_POSITION = Number.MIN_SAFE_INTEGER;

export class Rectangle {
    startCorner: Point;
    endCorner: Point;

    upperLeftCorner: Point;
    bottomRightCorner: Point;
    height: number;
    width: number;

    constructor() {
        this.startCorner = new Point(INVALID_POSITION, INVALID_POSITION);
        this.endCorner = new Point(INVALID_POSITION, INVALID_POSITION);

        this.upperLeftCorner = new Point(INVALID_POSITION, INVALID_POSITION);
        this.bottomRightCorner = new Point(INVALID_POSITION, INVALID_POSITION);
        this.height = 0;
        this.width = 0;
    }

    setStart(x: number, y: number): void {
        this.startCorner = new Point(x, y);
    }

    setEnd(x: number, y: number, isSquare: boolean): void {
        this.endCorner = new Point(x, y);
        this.interpretCorners(isSquare);
    }

    interpretCorners(isSquare: boolean): void {
        this.width = Math.abs(this.startCorner.x - this.endCorner.x);
        this.height = Math.abs(this.startCorner.y - this.endCorner.y);
        if (isSquare) {
            const difference = this.width - this.height;
            if (difference > 0) {
                this.endCorner.x += difference;
                this.width = this.height;
            } else {
                this.endCorner.y -= difference;
                this.height = this.width;
            }
        }
        this.upperLeftCorner.x = Math.min(this.startCorner.x, this.endCorner.x);
        this.upperLeftCorner.y = Math.min(this.startCorner.y, this.endCorner.y);
        this.bottomRightCorner.x = this.upperLeftCorner.x + this.width;
        this.bottomRightCorner.y = this.upperLeftCorner.y + this.height;
    }

    getCenter(): Point {
        return this.upperLeftCorner.plus(new Point(this.width / 2, this.height / 2));
    }

    isIntersecting(otherRectangle: Rectangle): boolean {
        const areSeparatedHorizontally =
            this.upperLeftCorner.x > otherRectangle.bottomRightCorner.x || this.bottomRightCorner.x < otherRectangle.upperLeftCorner.x;

        const areSeparatedVertically =
            this.upperLeftCorner.y > otherRectangle.bottomRightCorner.y || this.bottomRightCorner.y < otherRectangle.upperLeftCorner.y;
        return !(areSeparatedHorizontally || areSeparatedVertically);
    }

    translate(translationX: number, translationY: number): void {
        const newUpperLeftCorner: Point = this.upperLeftCorner.plus(new Point(translationX, translationY));
        const newBottomRightCorner: Point = this.bottomRightCorner.plus(new Point(translationX, translationY));
        this.setStart(newUpperLeftCorner.x, newUpperLeftCorner.y);
        this.setEnd(newBottomRightCorner.x, newBottomRightCorner.y, false);
    }

    centerAroundPoint(point: Point): void {
        const newUpperLeftCorner = new Point(point.x - this.width / 2, point.y - this.height / 2);
        const translation = newUpperLeftCorner.minus(this.upperLeftCorner);
        this.translate(translation.x, translation.y);
    }

    copy(otherRectangle: Rectangle): void {
        this.setStart(otherRectangle.upperLeftCorner.x, otherRectangle.upperLeftCorner.y);
        this.setEnd(otherRectangle.bottomRightCorner.x, otherRectangle.bottomRightCorner.y, false);
    }

    containsPoint(point: Point): boolean {
        const isInsideHorizontally = this.upperLeftCorner.x <= point.x && point.x <= this.bottomRightCorner.x;
        const isInsideVertically = this.upperLeftCorner.y <= point.y && point.y <= this.bottomRightCorner.y;
        return isInsideHorizontally && isInsideVertically;
    }
}
