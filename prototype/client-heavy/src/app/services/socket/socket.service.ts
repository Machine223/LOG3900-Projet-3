import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    socket: SocketIOClient.Socket;

    URI = 'https://p3-server.herokuapp.com';
    // URI = 'http://localhost:3000';

    connect(username: string) {
        this.socket = io(this.URI, { query: `username=${username}` });
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
}
