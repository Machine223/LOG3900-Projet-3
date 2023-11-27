import mongoose from 'mongoose';
import config from '../config';

export default async () => {
    mongoose.set('useCreateIndex', true);
    await mongoose
        .connect(config.mongoURL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false,
        })
        .catch((e) => {
            console.error('Mongoose connection failed:', e);
        });
    console.info('🙏  Mongoose loaded and connected');
};
