import { Router } from 'express';
import auth from './routes/auth';
import chat from './routes/chat';

export default () => {
    const app = Router();

    app.get('/', (req, res) => {
        res.status(418).send(`Sup my friend, server's up`);
    });

    chat(app);
    auth(app);
    return app;
};
