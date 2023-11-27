import { Component, OnInit } from '@angular/core';
import { MeleeGame } from '../game-family/melee/melee';
import { Role } from '../game-family/melee/role';

@Component({
    selector: 'app-word-choice',
    templateUrl: './word-choice.component.html',
    styleUrls: ['./word-choice.component.scss'],
})
export class WordChoiceComponent implements OnInit {
    game: MeleeGame;
    public get role(): typeof Role {
        return Role;
    }

    constructor() {}

    ngOnInit(): void {}
}
