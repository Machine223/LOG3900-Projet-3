import { Router } from 'express';
import auth from './routes/auth';
import avatar from './routes/avatar';
import chat from './routes/chat';
import gameroom from './routes/gameroom';
import pair from './routes/pair';
import profile from './routes/profile';

export default () => {
    const app = Router();

    app.get('/', (req, res) => {
        res.status(418).send(`Sup my friend, server's up`);
    });

    app.get('/time', (req, res) => {
        res.status(200).json(new Date());
    });

    chat(app);
    auth(app);
    profile(app);
    pair(app);
    avatar(app);
    gameroom(app);

    return app;
};
