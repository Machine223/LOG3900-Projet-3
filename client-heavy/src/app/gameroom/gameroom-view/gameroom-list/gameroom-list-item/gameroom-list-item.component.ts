import { Component, Input, OnInit } from '@angular/core';
import { Gameroom } from 'src/app/gameroom/gameroom';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { Subscriber } from 'src/app/helpers/subscriber';

@Component({
    selector: 'app-gameroom-list-item',
    templateUrl: './gameroom-list-item.component.html',
    styleUrls: ['./gameroom-list-item.component.scss'],
})
export class GameroomListItemComponent extends Subscriber implements OnInit {
    @Input() gameroom: Gameroom;
    humanPlayers: string[];
    virtualPlayers: string[];
    constructor(private constants: ConstantsRepositoryService) {
        super();
        this.humanPlayers = [];
        this.virtualPlayers = [];
    }

    ngOnInit(): void {
        this.updatePlayerLists();
        this.subscriptions.push(this.gameroom.usersChanged.subscribe(() => this.updatePlayerLists()));
    }

    updatePlayerLists(): void {
        this.humanPlayers = [];
        this.virtualPlayers = [];
        this.gameroom.users.forEach((user: string) => {
            this.constants.VIRTUAL_PLAYER_NAMES.has(user) ? this.virtualPlayers.push(user) : this.humanPlayers.push(user);
        });
    }

    joinGameroom(click: MouseEvent): void {
        click.stopPropagation();
        this.gameroom.joinGameroomEvent();
    }

    disabledClick(click: MouseEvent): void {
        click.stopPropagation();
    }
}
