import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import routes from '../api';

export default (app: express.Application) => {
    // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // It shows the real origin IP in the heroku or Cloudwatch logs
    app.enable('trust proxy');

    // The magic package that prevents frontend developers going nuts
    app.use(cors());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Load API routes
    app.use('/', routes());
};
