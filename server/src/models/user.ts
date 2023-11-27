import mongoose from 'mongoose';
import { IUser } from '../interfaces/IUser';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarName: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    theme: { type: Number, required: true },
});

export default mongoose.model<IUser & mongoose.Document>('user', userSchema);
