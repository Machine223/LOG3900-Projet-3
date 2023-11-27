import { Injectable } from '@angular/core';
import { SocketService } from 'src/app/chat/socket.service';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { ProfileManagerService } from 'src/app/profile/profile-manager.service';
import { TutorialService } from 'src/app/tutorial/tutorial.service';
import { INetworkHintAsked } from '../game-network-interface/network-game-hint-asked';
import { INetworkWordBadGuess } from '../game-network-interface/network-game-word-bad-guess';
import { INetworkWordChoice } from '../game-network-interface/network-game-word-choice';
import { INetworkWordGoodGuess } from '../game-network-interface/network-game-word-good-guess';

@Injectable({
    providedIn: 'root',
})
export class GameCommunicationsService {
    constructor(
        private socketService: SocketService,
        private constants: ConstantsRepositoryService,
        private profileManager: ProfileManagerService,
        private tutorial: TutorialService,
    ) {}

    emitGoodGuess(gameroomName: string, nHints: number): void {
        const goodGuess: INetworkWordGoodGuess = {
            gameroomName,
            username: this.profileManager.userProfile.username,
            nHints,
        };
        if (this.tutorial.isTutorial) {
            this.tutorial.goodGuess(goodGuess);
        } else {
            this.socketService.emit(this.constants.GOOD_GUESS, JSON.stringify(goodGuess));
        }
    }

    emitBadGuess(gameroomName: string, word: string): void {
        const badGuess: INetworkWordBadGuess = {
            gameroomName,
            username: this.profileManager.userProfile.username,
            word,
        };
        if (this.tutorial.isTutorial) {
            this.tutorial.badGuess(badGuess);
        } else {
            this.socketService.emit(this.constants.BAD_GUESS, JSON.stringify(badGuess));
        }
    }

    emitWordChoice(words: string[], gameroomName: string): void {
        const wordChoice: INetworkWordChoice = {
            words,
            gameroomName,
        };
        this.socketService.emit(this.constants.WORD_CHOICE, JSON.stringify(wordChoice));
    }

    emitHintAsked(gameroomName: string): void {
        const hintAsked: INetworkHintAsked = {
            gameroomName,
            username: this.profileManager.userProfile.username,
        };
        this.socketService.emit(this.constants.HINT_ASKED, JSON.stringify(hintAsked));
    }
}
