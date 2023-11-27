import _ from 'lodash';
import Container from 'typedi';
import { IGameroomMetadata } from '../../interfaces/IGameroomMetadata';
import { DbCommunications } from '../../services/communications/dbCommunications.service';
import { GameCommunications } from '../../services/communications/gameCommunications.service';
import { PairManager } from '../../services/managers/pairManager.service';
import { VirtualChatter } from '../../services/virtualChatter.service';

export abstract class Game {
    gameroomMetadata: IGameroomMetadata;
    gameCommunications: GameCommunications;
    pairManager: PairManager;
    virtualChatter: VirtualChatter;
    dbCommunications: DbCommunications;

    constructor(gameroomMetadata: IGameroomMetadata) {
        this.gameCommunications = Container.get(GameCommunications);
        this.pairManager = Container.get(PairManager);
        this.virtualChatter = Container.get(VirtualChatter);
        this.dbCommunications = Container.get(DbCommunications);
        this.gameroomMetadata = gameroomMetadata;
    }

    // game
    abstract startGame(): void;
    abstract endGame(): void;

    // turn
    abstract dispatchTurnInfo(): Promise<void>;
    abstract startTurn(): Promise<void>;
    abstract endTurn(): void;
    abstract wordChoice(word: string): void;
    abstract hintAsked(username: string): void;

    // guess
    abstract goodGuess(goodGuesser: string): void;
    abstract badGuess(badGuesser: string, word: string): void;
    abstract newScore(goodGuesser: string): void;
    abstract attemptConsumed(): void;

    // draw
    abstract dispatchDrawNewElement(drawerUsername: string, dataString: string): void;
    abstract dispatchDrawNewCoords(drawerUsername: string, dataString: string): void;
    abstract dispatchDrawDeleteElement(drawerUsername: string, dataString: string): void;
    abstract dispatchDrawUndeleteCoords(drawerUsername: string, dataString: string): void;
    abstract drawEditBackground(drawerUsername: string, dataString: string): void;

    protected _dispatchToAllPlayers(event: string, obj: object) {
        this.gameroomMetadata.users.forEach((username: string) => {
            this.gameCommunications.dispatchToOne(event, username, obj);
        });
    }
    protected _dispatchStringToAllGuessers(drawerUsername: string, event: string, str: string) {
        this.gameroomMetadata.users.forEach((username: string) => {
            if (username !== drawerUsername) {
                this.gameCommunications.dispatchStringToOne(event, username, str);
            }
        });
    }
}
