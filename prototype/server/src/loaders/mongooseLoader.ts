import mongoose from 'mongoose';
import config from '../config';

export default async () => {
    await mongoose
        .connect(config.mongoURL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false,
        })
        .catch((e) => {
            console.error(e, 'Fuck');
        });
};
