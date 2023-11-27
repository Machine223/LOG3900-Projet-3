import { Application } from 'express';
import { Server } from 'http';
import Container from 'typedi';
import { ChatEventDispatcher } from '../services/dispatchers/chatEventDispatcher.service';
import { ConnectionDispatcher } from '../services/dispatchers/connectionDispatcher.service';
import { GameEventDispatcher } from '../services/dispatchers/gameEventDispatcher.service';
import { SessionManager } from '../services/managers/sessionManager.service';
import dependencyInjectorLoader from './dependencyInjectorLoader';
import expressLoader from './expressLoader';
import mongooseLoader from './mongooseLoader';

export default async (app: Application, server: Server) => {
    await mongooseLoader();

    await dependencyInjectorLoader([{ name: 'Server', element: server }]);

    await expressLoader(app);

    Container.get(ChatEventDispatcher);
    Container.get(GameEventDispatcher);
    Container.get(ConnectionDispatcher);

    const exitHook = require('async-exit-hook');
    exitHook((callback: any) => {
        console.log('\n💀 Server\'s dead. 💀');
        const sessionManager = Container.get(SessionManager);
        for (const username of sessionManager.sessions.keys()) {
            sessionManager.removeAll(username);
        }
    });
};
