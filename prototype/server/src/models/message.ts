import mongoose from 'mongoose';
import { IMessage } from '../interfaces/IMessage';

const messageSchema = new mongoose.Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Number, required: true },
});

export default mongoose.model<IMessage & mongoose.Document>('message', messageSchema);
