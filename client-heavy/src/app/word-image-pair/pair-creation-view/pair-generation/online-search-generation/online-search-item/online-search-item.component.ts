import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-online-search-item',
    templateUrl: './online-search-item.component.html',
    styleUrls: ['./online-search-item.component.scss'],
})
export class OnlineSearchItemComponent {
    @Input() imageLink: string;
    @Input() isSelected: boolean;

    constructor() {}
}
