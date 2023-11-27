import mongoose from 'mongoose';
import { IAvatar } from '../interfaces/IAvatar';

const avatarSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    svg: { type: String, required: true },
});

export default mongoose.model<IAvatar & mongoose.Document>('avatar', avatarSchema);
