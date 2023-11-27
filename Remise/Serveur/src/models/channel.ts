import mongoose from 'mongoose';
import { IChannelMetadata } from '../interfaces/IChannelMetadata';

const channelSchema = new mongoose.Schema({
    channelName: { type: String, required: true, unique: true },
    users: { type: Array, required: true },
    isGameChannel: { type: Boolean, required: true },
});

export default mongoose.model<IChannelMetadata & mongoose.Document>('channel', channelSchema);
