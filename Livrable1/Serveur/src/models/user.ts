import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { IUser } from '../interfaces/IUser';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Must use `function` to be able to use `this` keyword in strict mode
userSchema.pre<IUser & mongoose.Document>('save', async function (next) {
    const user = this;
    user.password = await bcrypt.hash(user.password, 10);
    next();
});

export default mongoose.model<IUser & mongoose.Document>('user', userSchema);
