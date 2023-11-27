import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    /* tslint:disable */
    selector: '[drawing-host]',
    /* tslint:enable */
})
export class DrawingDirective {
    constructor(public viewContainerRef: ViewContainerRef) {}
}
