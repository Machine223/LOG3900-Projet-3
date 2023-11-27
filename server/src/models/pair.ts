import mongoose from 'mongoose';
import { IPair } from '../interfaces/IPair';

const pairSchema = new mongoose.Schema({
    word: { type: String, required: true },
    hints: { type: Array, required: true },
    difficulty: { type: Number, required: true },
    delay: { type: Number, required: true },
    isRandom: { type: Boolean, required: true },
    drawing: {
        background: { type: String, required: true },
        backgroundOpacity: { type: Number, required: true },
        elements: { type: Array, required: true },
        coordinates: { type: Array, required: true },
    },
});

export default mongoose.model<IPair & mongoose.Document>('newpair', pairSchema);
