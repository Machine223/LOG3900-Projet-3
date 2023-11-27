import { Observable, Subject } from 'rxjs';
import { ChatCommunicationsService } from '../chat-communications.service';
import { IChatMessage } from '../chat-message/chat-message';
import { IWindowChannel } from '../windowed-chat/window-channel';

export class Channel {
    private _name: string;
    private _messages: Array<IChatMessage>;
    private _isJoined: boolean;
    private _isSelected: boolean;
    private _isGameChannel: boolean;
    private _nUnreadMessages: number;
    private _users: Set<string>;
    private _onNewMessageSource: Subject<void>;

    onNewMessage: Observable<void>;

    get name(): string {
        return this._name;
    }

    get users(): Set<string> {
        return this._users;
    }

    get isJoined(): boolean {
        return this._isJoined;
    }

    get isSelected(): boolean {
        return this._isSelected;
    }

    get nUnreadMessages(): number {
        return this._nUnreadMessages;
    }

    get messages(): Array<IChatMessage> {
        return this._messages;
    }

    get isGameChannel(): boolean {
        return this._isGameChannel;
    }

    constructor(private chatCommunications: ChatCommunicationsService, name: string, isGameChannel: boolean = false, users: string[]) {
        this.chatCommunications = chatCommunications;
        this._name = name;
        this._messages = new Array<IChatMessage>();
        this._isJoined = false;
        this._isSelected = false;
        this._isGameChannel = isGameChannel;
        this._nUnreadMessages = 0;
        this._onNewMessageSource = new Subject();
        this.onNewMessage = this._onNewMessageSource.asObservable();
        this._users = new Set(users);
    }

    deleteChannelEvent(): void {
        this.chatCommunications.deleteChannel(this.name);
    }

    joinChannelEvent(): void {
        this.chatCommunications.joinChannel(this.name);
    }

    leaveChannelEvent(): void {
        this.chatCommunications.leaveChannel(this.name);
    }

    sendNewMessageEvent(content: string): void {
        this.chatCommunications.sendMessage(this.name, content);
    }

    addMessage(chatMessage: IChatMessage): void {
        this._messages.push(chatMessage);
        if (!this.isSelected && !this._isGameChannel) {
            this._nUnreadMessages++;
        }
        this._onNewMessageSource.next();
    }

    joinChannel(): void {
        this._isJoined = true;
    }

    leaveChannel(): void {
        this._messages = new Array<IChatMessage>();
        this._isJoined = false;
        this._nUnreadMessages = 0;
    }

    selectChannel(): void {
        this._isSelected = true;
        this._nUnreadMessages = 0;
    }

    unselectChannel(): void {
        this._isSelected = false;
    }

    loadChatHistory(): void {
        this.chatCommunications.getChannelHistory(this.name, (chatMessages: Array<IChatMessage>) => {
            this._messages = chatMessages;
            this._onNewMessageSource.next();
        });
    }

    addUser(username: string): void {
        this._users.add(username);
    }

    removeUser(username: string): void {
        this._users.delete(username);
    }

    updateWithWindowChannel(windowChannel: IWindowChannel): void {
        this._nUnreadMessages = windowChannel.nUnreadMessages;
        this._messages = windowChannel.messages;
        this._onNewMessageSource.next();
    }
}
