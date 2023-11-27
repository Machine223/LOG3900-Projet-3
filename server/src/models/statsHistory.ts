import mongoose from 'mongoose';
import { IStatsHistory } from '../interfaces/IStatsHistory';

const avatarSchema = new mongoose.Schema({
    username: { type: String, required: true },
    history: {
        sessions: { type: Array, required: true },
        games: { type: Array, required: true },
    },
    statistics: {
        totalGamePlayed: { type: Number, required: true },
        totalFFAPlayed: { type: Number, required: true },
        totalSprintPlayed: { type: Number, required: true },
        totalFFAWin: { type: Number, required: true },
        FFAWinRatio: { type: Number, required: true },
        totalGameTime: { type: Number, required: true },
        timePerGame: { type: Number, required: true },
        bestSoloScore: { type: Number, required: true },
    },
});

export default mongoose.model<IStatsHistory & mongoose.Document>('statshistory', avatarSchema);
