import { Application } from 'express';
import message from '../models/message';
import user from '../models/user';
import dependencyInjectorLoader from './dependencyInjectorLoader';
import expressLoader from './expressLoader';
import mongooseLoader from './mongooseLoader';

// We have to import at least all the events once so they can be triggered
import './events';

export default async (app: Application) => {
    await mongooseLoader();
    console.info('🙏  DB loaded and connected');

    const messageModel = {
        name: 'messageModel',
        model: message,
    };
    const userModel = {
        name: 'userModel',
        model: user,
    };
    await dependencyInjectorLoader([messageModel, userModel]);
    console.info('🙏  Dependency Injector loaded');

    await expressLoader(app);
    console.info('🙏  Express loaded');
};
