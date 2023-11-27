import express from 'express';
import 'reflect-metadata';
import config from './config';
import loaders from './loaders';

async function startServer() {
    const app = express();

    const server = app.listen(config.port, () => {
        console.info(`
            ####################################
            🙏  Server listening on port:${config.port}  🙏
            ####################################
        `);
    });

    await loaders(app, server);
}

startServer();
