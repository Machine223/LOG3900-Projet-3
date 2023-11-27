import mongoose from 'mongoose';
import { IQuickDrawPair } from '../interfaces/IQuickDrawPair';

const quickDrawPairSchema = new mongoose.Schema({
    word: { type: String, required: true },
    countrycode: { type: String, required: true },
    timestamp: { type: String, required: true },
    recognized: { type: Boolean, required: true },
    key_id: { type: String, required: true },
    drawing: { type: Array, required: true },
});

export default mongoose.model<IQuickDrawPair & mongoose.Document>('quickdrawpair', quickDrawPairSchema);
