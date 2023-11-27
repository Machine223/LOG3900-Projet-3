import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscriber } from 'src/app/helpers/subscriber';
import { DrawingWindowInfoService } from '../drawing-window-info.service';

@Component({
    selector: 'app-lateral-bar-button',
    templateUrl: './lateral-bar-button.component.html',
    styleUrls: ['./lateral-bar-button.component.scss'],
})
export class LateralBarButtonComponent extends Subscriber implements OnInit {
    @Input() name: string;
    @Input() imageUrl: string;
    @Input() isCurrentlySelected: boolean;
    @Output() buttonClicked = new EventEmitter();
    @Input() isDisabled: boolean;
    constructor(public windowInfoTracker: DrawingWindowInfoService) {
        super();
        this.isDisabled = false;
    }

    ngOnInit(): void {
    }

    onClick(): void {
        this.buttonClicked.emit(this.name);
    }
}
