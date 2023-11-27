import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

const envFound = dotenv.config();
if (envFound.error) {
    throw new Error('⚠️ Couldn\'t find .env file ⚠️');
}

export default {
    port: parseInt(process.env.PORT || '3000', 10),
    mongoURL: process.env.MONGODB_URI || '',
};
