import { Request, Response, Router } from 'express';
import _ from 'lodash';
import Container from 'typedi';
import { IAvatar } from '../../interfaces/IAvatar';
import { DbCommunications } from '../../services/communications/dbCommunications.service';

const route = Router();

export default (app: Router) => {
    app.use('/avatar', route);

    route.get('/all', async (req: Request, res: Response) => {
        const avatars: IAvatar[] = await Container.get(DbCommunications).getAllAvatars();
        res.json({ avatars });
    });

    route.get('/all-virtual', async (req: Request, res: Response) => {
        const avatars: IAvatar[] = await Container.get(DbCommunications).getAllVirtualAvatars();
        res.json({ avatars });
    });
};
