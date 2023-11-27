export class Point {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    minus(otherPoint: Point): Point {
        return new Point(this.x - otherPoint.x, this.y - otherPoint.y);
    }

    plus(otherPoint: Point): Point {
        return new Point(this.x + otherPoint.x, this.y + otherPoint.y);
    }

    getScaledWith(otherPoint: Point): Point {
        const xValue = otherPoint.x === 0 ? 1 : this.x / otherPoint.x;
        const yValue = otherPoint.y === 0 ? 1 : this.y / otherPoint.y;
        return new Point(xValue, yValue);
    }

    scalarProduct(otherPoint: Point): number {
        return this.x * otherPoint.x + this.y * otherPoint.y;
    }

    getUnsignedDistance(otherPoint: Point): Point {
        return new Point(Math.abs(this.x - otherPoint.x), Math.abs(this.y - otherPoint.y));
    }

    getEuclidianDistance(otherPoint: Point): number {
        const differencePoint = this.minus(otherPoint);
        return Math.hypot(differencePoint.x, differencePoint.y);
    }

    getNormalizedPoint(): Point {
        const normalizedPoint = new Point();
        if (this.x !== 0 || this.y !== 0) {
            const norm = Math.hypot(this.x, this.y);
            normalizedPoint.x = this.x / norm;
            normalizedPoint.y = this.y / norm;
        }
        return normalizedPoint;
    }

    copy(otherPoint: Point): void {
        this.x = otherPoint.x;
        this.y = otherPoint.y;
    }

    toString(): string {
        return `${this.x},${this.y}`;
    }
}
