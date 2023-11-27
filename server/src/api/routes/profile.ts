import { Request, Response, Router } from 'express';
import _ from 'lodash';
import Container from 'typedi';
import { GENERAL_CHANNEL } from '../../constants';
import { IUser } from '../../interfaces/IUser';
import { DbCommunications } from '../../services/communications/dbCommunications.service';
import { ChannelManager } from '../../services/managers/channelManager.service';

const route = Router();

export default (app: Router) => {
    app.use('/profile', route);

    route.post('/', async (req: Request, res: Response) => {
        try {
            const user = req.body as IUser;
            await Container.get(DbCommunications).saveUser(user);
            await Container.get(ChannelManager).addUserToChannel(user.username, GENERAL_CHANNEL);
            res.status(200).json('Sign up succeeded');
        } catch (e) {
            res.status(400).json(`Sign up failed, error : ${e}`);
        }
    });

    route.get('/:username', async (req: Request, res: Response) => {
        const username: string = req.params.username;
        const profile = await Container.get(DbCommunications).getProfile(username);
        _.set(profile, 'password', 'Server\'s secret <3');
        res.json(profile);
    });

    route.get('/:username/stats-history', async (req: Request, res: Response) => {
        const username: string = req.params.username;
        const statsHistory = await Container.get(DbCommunications).getStatsHistory(username);
        res.json(statsHistory);
    });

    route.put('/theme', async (req: Request, res: Response) => {
        try {
            const { theme, username } = req.body;
            Container.get(DbCommunications).updateTheme(username, theme);
            res.status(200).json('Update theme succeeded');
        } catch (e) {
            res.status(404).json(`Update theme failed, error : ${e}`);
        }
    });
};
