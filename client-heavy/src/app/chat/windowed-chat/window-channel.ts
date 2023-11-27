import { IChatMessage } from '../chat-message/chat-message';

export interface IWindowChannel {
    name: string;
    messages: IChatMessage[];
    nUnreadMessages: number;
}
