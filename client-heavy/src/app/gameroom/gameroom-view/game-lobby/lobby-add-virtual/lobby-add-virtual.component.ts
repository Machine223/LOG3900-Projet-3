import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Gameroom } from 'src/app/gameroom/gameroom';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { TutorialService } from 'src/app/tutorial/tutorial.service';

@Component({
    selector: 'app-lobby-add-virtual',
    templateUrl: './lobby-add-virtual.component.html',
    styleUrls: ['./lobby-add-virtual.component.scss'],
})
export class LobbyAddVirtualComponent {
    @Input() gameroom: Gameroom;
    @Output() addVirtualPlayer: EventEmitter<string>;

    get isCompleteForTutorial(): boolean {
        return this.tutorial.isTutorial && this.tutorial.nVirtualPlayers === 0;
    }

    constructor(public constants: ConstantsRepositoryService, private tutorial: TutorialService) {
        this.addVirtualPlayer = new EventEmitter();
    }
}
