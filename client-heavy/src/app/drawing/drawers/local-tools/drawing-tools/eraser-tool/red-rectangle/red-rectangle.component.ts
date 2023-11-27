import { Component, Input, OnInit } from '@angular/core';
import { RedRectangle } from '../red-rectangle';

@Component({
    /* tslint:disable */
    selector: 'svg[app-red-rectangle]',
    /* tslint:enable */
    templateUrl: './red-rectangle.component.html',
    styleUrls: ['./red-rectangle.component.scss'],
})
export class RedRectangleComponent implements OnInit {
    @Input() data: RedRectangle;

    constructor() {
        this.data = new RedRectangle();
    }

    ngOnInit(): void {}
}
