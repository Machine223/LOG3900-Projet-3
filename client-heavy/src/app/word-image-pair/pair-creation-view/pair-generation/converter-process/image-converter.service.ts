import { Injectable } from '@angular/core';
import * as potrace from 'potrace';
import { StrokeContainerService } from 'src/app/drawing/drawers/stroke-container/stroke-container.service';
import { Point } from 'src/app/drawing/drawers/stroke/point';
import { Stroke } from 'src/app/drawing/drawers/stroke/stroke';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { UidGeneratorService } from 'src/app/helpers/uid-generator.service';

@Injectable({
    providedIn: 'root',
})
export class ImageConverterService {
    isConverting: boolean;
    paths: IPathAndPoints[];

    strokeWidth: number;
    strokeColor: string;
    minimumLength: number;
    opacity: number;

    constructor(
        private strokeContainer: StrokeContainerService,
        private constants: ConstantsRepositoryService,
        private uidGenerator: UidGeneratorService,
    ) {
        this.isConverting = false;
        this.paths = [];
        this.strokeWidth = 1;
        this.strokeColor = constants.BLACK_COLOR;
        this.minimumLength = constants.PATH_MINIMAL_LENGHT;
        this.opacity = 1;
    }

    convertAndDraw(base64Image: string): void {
        this.isConverting = true;

        potrace.posterize(base64Image, (err, svg: string) => {
            const pathSplitter = RegExp('\\s(?=M)');

            const svgDocument: Document = new DOMParser().parseFromString(svg, 'image/svg+xml');

            const htmlPaths: HTMLCollectionOf<SVGPathElement> = svgDocument.getElementsByTagName('path');

            this.paths = [];

            for (let i = 0; i < htmlPaths.length; i++) {
                const localPaths: string[] = htmlPaths.item(i).getAttribute('d').split(pathSplitter);
                localPaths.forEach((path: string) => {
                    const svgPath: SVGPathElement = this.createSVGPath(path);
                    if (svgPath.getTotalLength() > this.constants.PATH_MINIMAL_LENGHT) {
                        const pathPoints: Point[] = this.linearisePath(svgPath);
                        this.paths.push({
                            path: svgPath,
                            points: pathPoints,
                        });
                    }
                });
            }
            this.isConverting = false;
            setTimeout(() => this.drawImage(), 0);
        });
    }

    drawImage(): void {
        this.strokeContainer.resetContainer();
        this.paths.forEach((path: IPathAndPoints) => {
            if (path.path.getTotalLength() >= this.minimumLength) {
                const stroke = this.createStrokeFromPoints(path.points);
                this.strokeContainer.addShape(stroke.uid, stroke);
            }
        });
    }

    resetValues(): void {
        this.strokeWidth = 1;
        this.strokeColor = this.constants.BLACK_COLOR;
        this.minimumLength = this.constants.PATH_MINIMAL_LENGHT;
        this.opacity = 1;
        this.paths = [];
    }

    updateStrokeWidth(): void {
        this.strokeContainer.changeAllStrokeWidth(this.strokeWidth);
    }

    updateStrokeColor(): void {
        this.strokeContainer.changeAllStrokeColor(this.strokeColor);
    }

    updateOpacity(): void {
        this.strokeContainer.changeAllStrokeOpacity(this.opacity);
    }

    private createSVGPath(d: string): SVGPathElement {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        path.setAttribute('d', d);

        return path;
    }

    private linearisePath(path: SVGPathElement): Point[] {
        const points: Point[] = [];
        for (let i = 0.0; i <= path.getTotalLength(); i += this.constants.DISTANCE_PATH_POINTS) {
            const pt = path.getPointAtLength(i);
            points.push(new Point(pt.x, pt.y));
        }
        return points;
    }

    private createStrokeFromPoints(points: Point[]): Stroke {
        const stroke = new Stroke();
        stroke.uid = this.uidGenerator.getNewUid();
        for (let i = 0; i < points.length; i++) {
            if (i === 0) {
                stroke.addPoints(points[i].x, points[i].y, 0);
                stroke.firstCoordinate = new Point(points[i].x, points[i].y);
            }
            stroke.addLine(points[i].x, points[i].y);
        }
        stroke.strokeWidth = this.strokeWidth;
        stroke.primaryColor = this.strokeColor;
        stroke.primaryOpacity = this.opacity;
        stroke.isCircleShown = false;

        return stroke;
    }
}

interface IPathAndPoints {
    path: SVGPathElement;
    points: Point[];
}
