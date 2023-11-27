import { Injectable } from '@angular/core';
import { ShepherdService } from 'angular-shepherd';
import { Observable, Subject } from 'rxjs';
import { default as Step } from 'shepherd.js/src/types/step';
import { INetworkTurnInfo } from '../game/game-network-interface/network-game-turn-info';
import { INetworkTurnStart } from '../game/game-network-interface/network-game-turn-start';
import { INetworkWordBadGuess } from '../game/game-network-interface/network-game-word-bad-guess';
import { INetworkWordGoodGuess } from '../game/game-network-interface/network-game-word-good-guess';
import { INetworkGameroom } from '../gameroom/gameroom-network-interface/network-gameroom';
import { INetworkGameroomEdit } from '../gameroom/gameroom-network-interface/network-gameroom-edit';
import { INetworkStartGame } from '../gameroom/gameroom-network-interface/network-gameroom-start';
import { ConstantsRepositoryService } from '../helpers/constants-repository.service';
import { GameMode } from '../profile/user-profile/history/game-information/game-mode';
import { Difficulty } from '../word-image-pair/enums/difficulty';
import { turnInfo } from './turn-info';

@Injectable({
    providedIn: 'root',
})
export class TutorialService {
    /* tslint:disable:quotemark */
    private _isTutorial: boolean;
    private _gameroom: string;
    private _startTutorial: Subject<void>;
    private _newGameroom: Subject<INetworkGameroom>;
    private _addVirtualPlayer: Subject<INetworkGameroomEdit>;
    private _addUserGameroom: Subject<INetworkGameroomEdit>;
    private _startGame: Subject<INetworkStartGame>;
    private _turnEnd: Subject<void>;
    private _goodGuess: Subject<INetworkWordGoodGuess>;
    private _badGuess: Subject<INetworkWordBadGuess>;
    onStartTutorial: Observable<void>;
    onNewGameroom: Observable<INetworkGameroom>;
    onAddVirtualPlayer: Observable<INetworkGameroomEdit>;
    onAddUserGameroom: Observable<INetworkGameroomEdit>;
    onStartGame: Observable<INetworkStartGame>;
    onTurnEnd: Observable<void>;
    onGoodGuess: Observable<INetworkWordGoodGuess>;
    onBadGuess: Observable<INetworkWordBadGuess>;

    nVirtualPlayers: number;

    get isTutorial(): boolean {
        return this._isTutorial;
    }

    constructor(private constants: ConstantsRepositoryService, private tour: ShepherdService) {
        this._isTutorial = false;
        this._gameroom = '';
        this._startTutorial = new Subject<void>();
        this.onStartTutorial = this._startTutorial.asObservable();
        this._newGameroom = new Subject<INetworkGameroom>();
        this.onNewGameroom = this._newGameroom.asObservable();
        this._addVirtualPlayer = new Subject<INetworkGameroomEdit>();
        this.onAddVirtualPlayer = this._addVirtualPlayer.asObservable();
        this._addUserGameroom = new Subject<INetworkGameroomEdit>();
        this.onAddUserGameroom = this._addUserGameroom.asObservable();
        this._startGame = new Subject<INetworkStartGame>();
        this.onStartGame = this._startGame.asObservable();
        this._turnEnd = new Subject<void>();
        this.onTurnEnd = this._turnEnd.asObservable();
        this._goodGuess = new Subject<INetworkWordGoodGuess>();
        this.onGoodGuess = this._goodGuess.asObservable();
        this._badGuess = new Subject<INetworkWordBadGuess>();
        this.onBadGuess = this._badGuess.asObservable();

        this.nVirtualPlayers = 1;
    }

    start(): void {
        this._isTutorial = true;
        this.setupTour();
        this.tour.start();
        this._startTutorial.next();
    }

    nextStep(): void {
        if (this._isTutorial) {
            this.tour.next();
        }
    }

    getAllGamerooms(): INetworkGameroom[] {
        const virtualPlayer = this.constants.VIRTUAL_PLAYER_NAMES.values().next().value;
        return [
            {
                gameroomName: 'Gameroom 1',
                gameMode: GameMode.Melee,
                difficulty: Difficulty.Easy,
                users: ['Player 1', 'Player 2', 'Player 3', virtualPlayer],
                isInGame: true,
            },
            {
                gameroomName: 'Gameroom 2',
                gameMode: GameMode.Melee,
                difficulty: Difficulty.Easy,
                users: ['Player 4', 'Player 5', virtualPlayer],
                isInGame: true,
            },
            {
                gameroomName: 'Gameroom 3',
                gameMode: GameMode.Melee,
                difficulty: Difficulty.Easy,
                users: ['Player 6', 'Player 7', 'Player 8', virtualPlayer],
                isInGame: true,
            },
        ];
    }

    addGameroom(newGameroom: INetworkGameroom): void {
        this._newGameroom.next(newGameroom);
    }

    addVirtualPlayer(editGameroom: INetworkGameroomEdit): void {
        --this.nVirtualPlayers;
        this._addVirtualPlayer.next(editGameroom);
        this._gameroom = editGameroom.gameroomName;
    }

    addUserGameroom(): void {
        setTimeout(() => {
            const editGameroom: INetworkGameroomEdit = {
                gameroomName: this._gameroom,
                username: 'Player 1',
            };
            this._addUserGameroom.next(editGameroom);
            this.nextStep();
        }, 500);
    }

    startGame(gameroomStart: INetworkStartGame): void {
        this._startGame.next(gameroomStart);
    }

    drawerTurnInfo(user: string): INetworkTurnInfo {
        return {
            drawer: user,
            virtualDrawing: {
                drawing: {
                    elements: [],
                    coordinates: [],
                    background: '#ffffff',
                    backgroundOpacity: 1,
                },
                hints: [],
                word: 'cloud',
                difficulty: 1,
                delay: 100,
                isRandom: true,
            },
        };
    }

    guesserTurnInfo(): INetworkTurnInfo {
        return turnInfo;
    }

    turnStart(): INetworkTurnStart {
        return {
            endTimestamp: 60,
            nAttempts: 3,
        };
    }

    goodGuess(goodGuess: INetworkWordGoodGuess): void {
        this._goodGuess.next(goodGuess);
        this.nextStep();
    }

    badGuess(badGuess: INetworkWordBadGuess): void {
        this._badGuess.next(badGuess);
    }

    private destroy(): void {
        this._isTutorial = false;
        this.nVirtualPlayers = 1;
        this._startTutorial.next();
    }

    private setupTour(): void {
        this.tour.defaultStepOptions = {
            classes: 'shepherd-theme-custom',
            scrollTo: { behavior: 'smooth', block: 'center' },
            cancelIcon: {
                enabled: false,
            },
            popperOptions: {
                modifiers: [{ name: 'offset', options: { offset: [0, 20] } }],
            },
        };
        this.tour.requiredElements = [
            {
                selector: '.tour-mainMenuButton',
                message: 'You need to navigated to the main menu to start the tutorial',
                title: 'Wrong View',
            },
        ];
        this.tour.modal = true;
        this.tour.confirmCancel = false;

        const tutorial = this;
        const steps: Step.StepOptions[] = [
            {
                id: 'main-menu',
                attachTo: {
                    element: '.tour-mainMenuButton',
                    on: 'left',
                },
                title: 'Play game',
                text: ['Press PLAY to start the game creation process.'],
            },
            {
                id: 'pre-gameroom-game',
                attachTo: {
                    element: '.tour-preGameroomForm',
                    on: 'left',
                },
                title: 'Find gamerooms',
                text: [
                    'Find gamerooms by selecting a game mode and a difficulty. Press FIND GAMEROOMS to find gamerooms filtered by your selected parameters.',
                ],
            },
            {
                id: 'gameroom-list',
                attachTo: {
                    element: '.tour-gameroomContainer',
                    on: 'left',
                },
                title: 'Gamerooms',
                text: [
                    'Here is a list of gamerooms. You need to CREATE or JOIN a gameroom in order to start a game. As you can see, all the gamerooms are currently IN-GAME.',
                ],
                buttons: [
                    {
                        action(): void {
                            return this.next();
                        },
                        text: 'Next',
                        classes: 'mat-flat-button',
                    },
                ],
            },
            {
                id: 'create-gameroom',
                attachTo: {
                    element: '.tour-addGameroomFooter',
                    on: 'left',
                },
                title: 'Create a gameroom',
                text: [
                    // tslint:disable-next-line: max-line-length
                    'So let\'s create a gameroom. Enter a gameroom name and press the ENTER key or the "+" button to add your new gameroom.',
                ],
            },
            {
                id: 'game-lobby-gameRoomConditions',
                attachTo: {
                    element: '.tour-gameRoomConditions',
                    on: 'top',
                },
                title: 'Create a game',
                text: ['Now that you created your Free-for-all gameroom, you need to meet the game requirements to start a game.'],
                buttons: [
                    {
                        action(): void {
                            return this.next();
                        },
                        text: 'Next',
                        classes: 'mat-flat-button',
                    },
                ],
            },
            {
                id: 'game-lobby-virtual-player',
                attachTo: {
                    element: '.tour-lobbyInfo',
                    on: 'left',
                },
                title: 'Add a virtual player',
                text: [
                    'You can start by adding a virtual player. To do so, press the "+" button and select a virtual player. I will join your game shortly after.',
                ],
            },
            {
                id: 'game-lobby-virtual-player',
                attachTo: {
                    element: '.tour-startGameButton',
                    on: 'left',
                },
                title: 'Start game',
                text: [
                    'I joined your gameroom! Now we meet the requirements to start a game. Press START GAME and we can explore the different roles you can play in the Free-for-all game mode.',
                ],
            },
            {
                id: 'drawer-word',
                attachTo: {
                    element: '.tour-word',
                    on: 'left',
                },
                title: 'Word to draw',
                text: [
                    "Here's the drawer's interface! The word you need to draw is displayed here. The other players will try to guess the word by looking at your drawing.",
                ],
                buttons: [
                    {
                        action(): void {
                            return this.next();
                        },
                        text: 'Next',
                        classes: 'mat-flat-button',
                    },
                ],
            },
            {
                id: 'drawer-timer',
                attachTo: {
                    element: '.tour-timer',
                    on: 'left',
                },
                title: 'Time left',
                text: ['The time left for you to draw and for the others to guess is displayed here!'],
                buttons: [
                    {
                        action(): void {
                            return this.next();
                        },
                        text: 'Next',
                        classes: 'mat-flat-button',
                    },
                ],
            },
            {
                id: 'drawer-leaderboard',
                attachTo: {
                    element: '.tour-leaderboard',
                    on: 'left',
                },
                title: 'Leaderboard',
                text: [
                    "The leaderboard in Free-for-all displays who's the current drawer and each player's score. As a drawer, you win points according to the amount of players who guessed your word.",
                ],
                buttons: [
                    {
                        action(): void {
                            return this.next();
                        },
                        text: 'Next',
                        classes: 'mat-flat-button',
                    },
                ],
            },
            {
                id: 'drawer-pencil',
                attachTo: {
                    element: '.tour-pencil',
                    on: 'top',
                },
                title: 'Pencil',
                text: ['You have a set of tools to help you draw. Here, you have the pencil tool.'],
                buttons: [
                    {
                        action(): void {
                            return this.next();
                        },
                        text: 'Next',
                        classes: 'mat-flat-button',
                    },
                ],
            },
            {
                id: 'drawer-eraser',
                attachTo: {
                    element: '.tour-eraser',
                    on: 'top',
                },
                title: 'Eraser',
                text: ['Here, you have the eraser tool.'],
                buttons: [
                    {
                        action(): void {
                            return this.next();
                        },
                        text: 'Next',
                        classes: 'mat-flat-button',
                    },
                ],
            },
            {
                id: 'drawer-grid',
                attachTo: {
                    element: '.tour-grid',
                    on: 'top',
                },
                title: 'Grid',
                text: ['Here, you have the grid tool. You can toggle it on and a resizable grid will appear on the canvas.'],
                buttons: [
                    {
                        action(): void {
                            return this.next();
                        },
                        text: 'Next',
                        classes: 'mat-flat-button',
                    },
                ],
            },
            {
                id: 'drawer-undo',
                attachTo: {
                    element: '.tour-undo',
                    on: 'top',
                },
                title: 'Undo',
                text: ['You have the undo button here.'],
                buttons: [
                    {
                        action(): void {
                            return this.next();
                        },
                        text: 'Next',
                        classes: 'mat-flat-button',
                    },
                ],
            },
            {
                id: 'drawer-redo',
                attachTo: {
                    element: '.tour-redo',
                    on: 'top',
                },
                title: 'Redo',
                text: ['Finally, you have the redo button here.'],
                buttons: [
                    {
                        action(): void {
                            return this.next();
                        },
                        text: 'Next',
                        classes: 'mat-flat-button',
                    },
                ],
            },
            {
                id: 'drawer-drawing',
                attachTo: {
                    element: '.tour-draw',
                    on: 'left',
                },
                title: 'Draw',
                text: [
                    // tslint:disable-next-line: max-line-length
                    'Go ahead and start drawing the word on the canvas using the presented drawing tools.',
                ],
                buttons: [
                    {
                        action(): void {
                            tutorial._turnEnd.next();
                            return this.next();
                        },
                        text: 'Next',
                        classes: 'mat-flat-button',
                    },
                ],
            },
            {
                id: 'guesser-drawing-surface',
                attachTo: {
                    element: '.tour-drawing-surface',
                    on: 'left',
                },
                title: 'The guesser interface',
                text: ["Here's the guesser's interface! I'm drawing now and you have to guess the word."],
                buttons: [
                    {
                        action(): void {
                            return this.next();
                        },
                        text: 'Next',
                        classes: 'mat-flat-button',
                    },
                ],
            },
            {
                id: 'guesser-guess-info',
                attachTo: {
                    element: '.tour-guess-info',
                    on: 'left',
                },
                title: 'Attempts and hints',
                text: [
                    'To help you guess the word, your previous attempts will be displayed here. You can also ask for hints at the cost of lowering the amount of points you can win if you guess the word correctly. Press the "+" button to ask for a hint.',
                ],
                buttons: [
                    {
                        action(): void {
                            return this.next();
                        },
                        text: 'Next',
                        classes: 'mat-flat-button',
                    },
                ],
            },
            {
                id: 'guesser-guess',
                attachTo: {
                    element: '.tour-gameInfo',
                    on: 'top',
                },
                title: 'Guess',
                text: ['Now try to guess the word! Type your answer in the "Answer" text field below the canvas.'],
            },
            {
                id: 'end',
                title: 'End of tutorial',
                text: [
                    "This concludes the tutorial. Now you know the game creation process and how to use the drawer's and the guesser's game interfaces.",
                ],
                buttons: [
                    {
                        action(): void {
                            tutorial.destroy();
                            return this.next();
                        },
                        text: 'Exit',
                        classes: 'mat-flat-button',
                    },
                ],
            },
        ];

        this.tour.addSteps(steps);
        // tslint:disable-next-line: no-string-literal
        this.tour.tourObject['options']['exitOnEsc'] = false;
        // tslint:disable-next-line: no-string-literal
        this.tour.tourObject['options']['keyboardNavigation'] = false;
    }
}
