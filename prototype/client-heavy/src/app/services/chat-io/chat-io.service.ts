import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../../chat/message';
import { SocketService } from '../socket/socket.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService } from '../alert/alert.service';


@Injectable({
    providedIn: 'root',
})
export class ChatIOService {
    newMessageSubject: Subject<Message>;
    username: string;

    constructor(
        private socketService: SocketService,
        private http: HttpClient,
        private router: Router,
        private alertService: AlertService
    ) {
        this.newMessageSubject = new Subject();
    }

    getMessage(): void {
        this.socketService
            .listen('chat message')
            .subscribe((messageString: string) => {
                this.newMessageSubject.next(
                    JSON.parse(messageString) as Message
                );
            });
    }

    sendMessage(content: string): void {
        const trimmedContent = content.trim();
        if (trimmedContent === '') {
            return;
        }

        const message: Message = {
            author: this.username,
            content: trimmedContent,
            timestamp: undefined,
        };
        this.socketService.emit('chat message', JSON.stringify(message));
    }

    signUp(username: string, password: string): void {
        const body = { username, password };
        this.http
            .post(`${this.socketService.URI}/auth/signUp`, body)
            .subscribe((res) => {
                this.alertService.success('success');
                this.username = username;
                this.loadChatHistory();
                this.router.navigateByUrl('/chat');
                this.socketService.connect(this.username);
                this.getMessage();
            }, error => {
                if (error.status === 400){
                    this.alertService.error('error ' + error.status + ': User already exists!');
                }
            });
    }

    login(username: string, password: string): void {
        const options = { headers: { username, password } };
        this.http
            .get(`${this.socketService.URI}/auth/signIn`, options)
            .subscribe((res) => {
                this.alertService.success('success');
                this.username = username;
                this.loadChatHistory();
                this.router.navigateByUrl('/chat');
                this.socketService.connect(this.username);
                this.getMessage();
            }, error => {
                if (error.status === 400){
                    this.alertService.error('error ' + error.status + ': User is connected !');
                }
                if (error.status === 401){
                    this.alertService.error('error ' + error.status + ': Invalid password or username !');
                }
            });
    }

    logOut(): void {
        const body = { username: this.username };
        this.socketService.socket.close();
        this.http
            .post(`${this.socketService.URI}/auth/signOut`, body)
            .subscribe((res) => {
                this.router.navigateByUrl('/login');
            });
    }

    loadChatHistory(): void {
        this.http
            .get(`${this.socketService.URI}/chat/history`)
            .subscribe((messages: Message[]) => {
                messages.forEach((message: Message) => {
                    this.newMessageSubject.next(message);
                });
            });
    }
}
