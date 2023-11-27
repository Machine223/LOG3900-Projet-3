import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Subscriber } from 'src/app/helpers/subscriber';
import { AvatarService } from './avatar.service';

@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent extends Subscriber implements OnInit, AfterViewInit {
    @Input() readonly user: string;
    isAvatarAssigned: boolean;
    avatarSVG: string;

    constructor(private avatarService: AvatarService, private changeDetector: ChangeDetectorRef) {
        super();
    }

    ngOnInit(): void {
        this.isAvatarAssigned = false;
    }

    ngAfterViewInit(): void {
        this.getAvatar();
    }

    getAvatar(): void {
        this.avatarService.getAvatar(this.user, (avatarSVG: string) => {
            this.avatarSVG = avatarSVG;
            this.isAvatarAssigned = Boolean(this.avatarSVG);
            if (this.isAvatarAssigned) {
                this.changeDetector.detectChanges();
            }
        });
    }
}
