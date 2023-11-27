import express from 'express';
import 'reflect-metadata';
import Container from 'typedi';
import config from './config';
import loaders from './loaders';
import { SocketService } from './services/socket.service';

async function startServer() {
    const app = express();

    await loaders(app);

    const server = app.listen(config.port, () => {
        console.info(`
            ####################################
            🙏  Server listening on port:${config.port}  🙏
            ####################################
        `);
    });

    Container.get(SocketService).init(server);
    console.info('🙏  Socket initialized');
}

startServer();
