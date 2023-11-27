import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'app-composer',
    templateUrl: './composer.component.html',
    styleUrls: ['./composer.component.scss'],
})
export class ComposerComponent implements AfterViewInit {
    @ViewChild('composer', { static: false }) composer: ElementRef;
    @Output() newMessage: EventEmitter<string>;
    composedMessage: string;

    constructor(private changeDetector: ChangeDetectorRef) {
        this.composedMessage = '';
        this.newMessage = new EventEmitter<string>();
    }

    ngAfterViewInit(): void {
        this.composer.nativeElement.focus();
        this.changeDetector.detectChanges();
    }

    onSend(event: Event): void {
        event.preventDefault();
        if (this.composedMessage.trim().length > 0) {
            this.newMessage.emit(this.composedMessage.trim());
        }
        this.composedMessage = '';
        this.composer.nativeElement.focus();
    }
}
