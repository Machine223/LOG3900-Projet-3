import { Request, Response, Router } from 'express';
import _ from 'lodash';
import Container from 'typedi';
import { IUser } from '../../interfaces/IUser';
import { AuthService } from '../../services/auth.service';

const route = Router();

export default (app: Router) => {
    app.use('/auth', route);

    route.post('/signUp', async (req: Request, res: Response) => {
        try {
            await Container.get(AuthService).signUp(req.body as IUser);
            res.status(200).json('Sign up succeeded');
        } catch (error) {
            res.status(400).json('Sign up failed');
        }
    });

    route.get('/signIn', async (req: Request, res: Response) => {
        const username = _.get(req, 'headers.username', '');
        const password = _.get(req, 'headers.password', '');
        const statusCode = await Container.get(AuthService).signIn(username, password);
        const status = statusCode === 200 ? 'succeeded' : 'failed';
        res.status(statusCode).json(`Sign in ${status}`);
    });

    route.post('/signOut', async (req: Request, res: Response) => {
        try {
            await Container.get(AuthService).signOut((req.body as { username: string }).username);
            res.status(200).json('Sign out succeeded');
        } catch (error) {
            res.status(400).json('Sign out failed');
        }
    });
};
