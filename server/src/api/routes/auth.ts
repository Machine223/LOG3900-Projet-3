import { Request, Response, Router } from 'express';
import _ from 'lodash';
import Container from 'typedi';
import { SessionManager } from '../../services/managers/sessionManager.service';

const route = Router();

export default (app: Router) => {
    app.use('/session', route);

    route.get('/', async (req: Request, res: Response) => {
        const username = _.get(req, 'headers.username', '');
        const password = _.get(req, 'headers.password', '');
        const statusCode = await Container.get(SessionManager).signIn(username, password);
        const status = statusCode === 200 ? 'succeeded' : 'failed';
        res.status(statusCode).json(`Sign in ${status}`);
    });

    route.delete('/', async (req: Request, res: Response) => {
        try {
            const username = _.get(req, 'headers.username', '');
            Container.get(SessionManager).removeAll(username);
            res.status(200).json('Sign out succeeded');
        } catch (e) {
            res.status(400).json(`Sign out failed, error : ${e}`);
        }
    });
};
