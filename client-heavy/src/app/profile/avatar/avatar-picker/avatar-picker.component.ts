import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AvatarService } from '../avatar.service';
import { INetworkAvatar } from '../network-avatar';

@Component({
    selector: 'app-avatar-picker',
    templateUrl: './avatar-picker.component.html',
    styleUrls: ['./avatar-picker.component.scss'],
})
export class AvatarPickerComponent implements OnInit {
    @Output() avatarName: EventEmitter<string>;
    avatars: INetworkAvatar[];
    selectedAvatar: string;

    constructor(private avatarService: AvatarService) {
        this.avatarName = new EventEmitter<string>();
        this.selectedAvatar = '';
    }

    ngOnInit(): void {
        this.getAvatars();
    }

    onAvatarSelect(name: string): void {
        this.selectedAvatar = this.avatarService.avatars.get(name);
        this.avatarName.emit(name);
    }

    private getAvatars(): void {
        this.avatars = [];
        this.avatarService.avatars.forEach((value, key) => {
            const avatar: INetworkAvatar = {
                name: key,
                svg: this.changeSVGSize(value),
            };
            this.avatars.push(avatar);
        });
    }

    private changeSVGSize(value: string): string {
        const svg: SVGElement = new DOMParser().parseFromString(value, 'image/svg+xml').querySelector('svg');
        svg.setAttribute('width', '48px');
        svg.setAttribute('height', '48px');
        return new XMLSerializer().serializeToString(svg);
    }
}
