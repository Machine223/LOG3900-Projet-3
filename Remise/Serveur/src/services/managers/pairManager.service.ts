import _ from 'lodash';
import Container, { Service } from 'typedi';
import { IPair } from '../../interfaces/IPair';
import { DbCommunications } from '../communications/dbCommunications.service';

@Service()
export class PairManager {
    constructor(private dbCommunications: DbCommunications) {}

    async addPair(pair: IPair) {
        await this.dbCommunications.savePair(pair);
    }

    async getOneRandomPairByWord(word: string): Promise<IPair | undefined> {
        const pairs: IPair[] = await Container.get(DbCommunications).getPairsByWord(word);
        pairs.forEach((pair: IPair) => {
            if (pair.isRandom) {
                pair.drawing.coordinates = _.shuffle(pair.drawing.coordinates);
            }
        });
        return _.sample(pairs);
    }

    async getOneRandomPairByDifficulty(difficulty: number): Promise<IPair | undefined> {
        const pairs: IPair[] = await Container.get(DbCommunications).getPairsByDifficulty(difficulty);
        pairs.forEach((pair: IPair) => {
            if (pair.isRandom) {
                pair.drawing.coordinates = _.shuffle(pair.drawing.coordinates);
            }
        });
        return _.sample(pairs);
    }

    async getThreePairs(): Promise<Map<string, IPair>> {
        const threePairs = await Container.get(DbCommunications).getNRandomPair(3);
        const pairsMap = new Map();
        for (let pair of threePairs) {
            while (pairsMap.has(pair.word)) {
                pair = (await Container.get(DbCommunications).getNRandomPair(1))[0];
            }
            pairsMap.set(pair.word, pair);
        }
        return pairsMap;
    }
}
