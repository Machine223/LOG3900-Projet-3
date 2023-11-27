import { Document, Model } from 'mongoose';
import { IMessage } from '../interfaces/IMessage';
import { IUser } from '../interfaces/IUser';

declare global {
    namespace Models {
        export type MessageModel = Model<IMessage & Document>;
        export type UserModel = Model<IUser & Document>;
    }
}
