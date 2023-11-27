import { Component, Input } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ZoomService } from '../../zoom.service';
import { Channel } from '../channel';

@Component({
    selector: 'app-zoom',
    templateUrl: './zoom.component.html',
    styleUrls: ['./zoom.component.scss'],
})
export class ZoomComponent {
    @Input() channel: Channel;

    get users(): string[] {
        return this.zoomService.users;
    }

    get isVoiceChat(): boolean {
        return this.channel.name === this.zoomService.currentChannel;
    }

    constructor(private zoomService: ZoomService) {}

    onToggleChange(event: MatSlideToggleChange): void {
        if (event.checked) {
            this.zoomService.connect(this.channel.name);
        } else {
            this.zoomService.disconnect();
        }
    }
}
