import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { ConstantsRepositoryService } from '../helpers/constants-repository.service';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    private socket: SocketIOClient.Socket;
    private isConnectedSubject: BehaviorSubject<boolean>;
    isConnectedObservable: Observable<boolean>;

    constructor(private constants: ConstantsRepositoryService) {
        this.isConnectedSubject = new BehaviorSubject<boolean>(false);
        this.isConnectedObservable = this.isConnectedSubject.asObservable();
    }

    public get isConnected(): boolean {
        return this.isConnectedSubject.value;
    }

    connect(username: string): void {
        this.socket = io(this.constants.URI, { query: `username=${username}` });
        this.isConnectedSubject.next(true);
    }

    listen(eventName: string): Observable<any> {
        return new Observable((subscriber) => {
            this.socket.on(eventName, (data: any) => {
                subscriber.next(data);
            });
        });
    }

    emit(eventName: string, data: any): void {
        this.socket.emit(eventName, data);
    }

    disconnect(): void {
        this.socket.disconnect();
        this.isConnectedSubject.next(false);
    }
}
