import { Request, Response, Router } from 'express';
import _ from 'lodash';
import request from 'request';
import Container from 'typedi';
import { IPair } from '../../interfaces/IPair';
import { IQuickDrawPair } from '../../interfaces/IQuickDrawPair';
import { DbCommunications } from '../../services/communications/dbCommunications.service';
import { OnlineSearchManager } from '../../services/managers/onlineSearchManager.service';
import { PairManager } from '../../services/managers/pairManager.service';

const route = Router();

export default (app: Router) => {
    app.use('/pair', route);

    route.post('/', async (req: Request, res: Response) => {
        try {
            const pair = req.body as IPair;
            pair.word = pair.word.toLowerCase();
            await Container.get(PairManager).addPair(pair);
            res.status(200).json('Save pair succeeded');
        } catch (e) {
            res.status(400).json(`Save pair failed, error : ${e}`);
        }
    });

    route.get('/quick-draw-random', async (req: Request, res: Response) => {
        const quickDrawPair: IQuickDrawPair = await Container.get(DbCommunications).getQuickDrawPair();
        res.json({ quickDrawPair });
    });

    route.get('/online-search/:word/:page', async (req: Request, res: Response) => {
        try {
            const word: string = req.params.word;
            const page: number = Number.parseInt(req.params.page);

            const imageLinks: string[] = await Container.get(OnlineSearchManager).searchImages(word, page);
            if (imageLinks.length === 0) {
                res.status(502).json(`Could not retrieve any search results`);
            } else {
                res.json(imageLinks);
            }
        } catch (e) {
            res.status(502).json(`Could not retrieve search results, error : ${e}`);
        }
    });

    route.get('/online-image', async (req: Request, res: Response) => {
        const imagePath = _.get(req, 'headers.path', '');

        var options = {
            method: 'GET',
            url: imagePath,
            encoding: null,
        };

        request(options, function (err, response, body: Buffer) {
            if (!err && response.statusCode == 200) {
                var bodyBeginning: string = body.toString('ascii', 0, 1);
                if (!bodyBeginning.startsWith('<')) {
                    res.json(body.toString('base64'));
                } else {
                    res.status(502).json(`Could not retrieve desired image`);
                }
            } else {
                res.status(response.statusCode).json(`Could not retrieve desired image, error : ${err}`);
            }
        });
    });

    route.get('/all-words', async (req: Request, res: Response) => {
        const pairs: IPair[] = await Container.get(DbCommunications).getAllPairs();
        const words: string[] = [];
        pairs.forEach((pair: IPair) => {
            words.push(pair.word);
        });
        res.json({ words });
    });

    route.get('/:word', async (req: Request, res: Response) => {
        const word: string = req.params.word;
        const pairs: IPair[] = await Container.get(DbCommunications).getPairsByWord(word);
        pairs.forEach((pair: IPair) => {
            if (pair.isRandom) {
                pair.drawing.coordinates = _.shuffle(pair.drawing.coordinates);
            }
        });
        res.json({ pairs });
    });
};
