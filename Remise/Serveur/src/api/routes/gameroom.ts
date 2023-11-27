import { Request, Response, Router } from 'express';
import _ from 'lodash';
import Container from 'typedi';
import { IGameroomMetadata } from '../../interfaces/IGameroomMetadata';
import { GameroomManager } from '../../services/managers/gameroomManager.service';

const route = Router();

export default (app: Router) => {
    app.use(route);

    route.get('/gamerooms', async (req: Request, res: Response) => {
        const gameMetadatas: IGameroomMetadata[] = Container.get(GameroomManager).getGameroomMetadatas();
        res.json({ gamerooms: gameMetadatas });
    });
};
