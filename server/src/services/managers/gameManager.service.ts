import _ from 'lodash';
import { Service } from 'typedi';
import { Game } from '../../classes/Game/Game';
import { GameFFA } from '../../classes/Game/GameFFA';
import { GameSprint } from '../../classes/Game/GameSprint';
import { GAME_MODES } from '../../constants';
import { IGameroomMetadata } from '../../interfaces/IGameroomMetadata';

@Service()
export class GameManager {
    games: Map<string, Game> = new Map();

    startGame(gameroomMetadata: IGameroomMetadata) {
        const gameroomName = gameroomMetadata.gameroomName;

        if (this.games.has(gameroomName)) {
            this.games.delete(gameroomName);
        }

        let game: Game | undefined;
        switch (gameroomMetadata.gameMode) {
            case GAME_MODES.FREE_FOR_ALL:
                game = new GameFFA(gameroomMetadata);
                break;
            case GAME_MODES.SPRINT_SOLO:
            case GAME_MODES.SPRINT_COOP:
                game = new GameSprint(gameroomMetadata);
                break;
            default:
                break;
        }
        if (game) {
            game.startGame();
            this.games.set(gameroomName, game);
        }
    }

    wordChoice(gameroomName: string, word: string) {
        const game = this.games.get(gameroomName);
        if (game) {
            game.wordChoice(word);
        }
    }
    hintAsked(username: string, gameroomName: string) {
        const game = this.games.get(gameroomName);
        if (game) {
            game.hintAsked(username);
        }
    }

    // guess
    goodGuess(gameroomName: string, username: string) {
        const game = this.games.get(gameroomName);
        if (game) {
            game.goodGuess(username);
        }
    }
    badGuess(gameroomName: string, username: string, word: string) {
        const game = this.games.get(gameroomName);
        if (game) {
            game.badGuess(username, word);
        }
    }

    // draw
    drawNewElement(drawerUsername: string, gameroomName: string, datastring: string) {
        const game = this.games.get(gameroomName);
        if (game) {
            game.dispatchDrawNewElement(drawerUsername, datastring);
        }
    }
    drawNewCoords(drawerUsername: string, gameroomName: string, datastring: string) {
        const game = this.games.get(gameroomName);
        if (game) {
            game.dispatchDrawNewCoords(drawerUsername, datastring);
        }
    }
    drawDeleteElement(drawerUsername: string, gameroomName: string, datastring: string) {
        const game = this.games.get(gameroomName);
        if (game) {
            game.dispatchDrawDeleteElement(drawerUsername, datastring);
        }
    }
    drawUndeleteCoords(drawerUsername: string, gameroomName: string, datastring: string) {
        const game = this.games.get(gameroomName);
        if (game) {
            game.dispatchDrawUndeleteCoords(drawerUsername, datastring);
        }
    }
    drawEditBackground(drawerUsername: string, gameroomName: string, datastring: string) {
        const game = this.games.get(gameroomName);
        if (game) {
            game.drawEditBackground(drawerUsername, datastring);
        }
    }
}
