import { Request, Response, Router } from 'express';
import Container from 'typedi';
import { SocketService } from '../../services/socket.service';
const route = Router();

export default (app: Router) => {
    app.use('/chat', route);

    route.get('/history', async (req: Request, res: Response) => {
        res.json(await Container.get(SocketService).getChatHistory());
    });
};
