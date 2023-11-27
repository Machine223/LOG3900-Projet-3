import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { ComposerComponent } from './chat/composer/composer.component';
import { ChatComponent } from './chat/chat.component';
import { MessageListComponent } from './chat/message-list/message-list.component';
import { MessageComponent } from './chat/message-list/message/message.component';
import { LoginComponent } from './login/login.component';
import { ChatHeaderComponent } from './chat/chat-header/chat-header.component';
import { AvatarComponent } from './chat/avatar/avatar.component';
import { RegisterComponent } from './register/register.component';
import { AlertComponent } from './alert/alert.component';


@NgModule({
    declarations: [
        AppComponent,
        MessageListComponent,
        MessageComponent,
        ComposerComponent,
        ChatComponent,
        LoginComponent,
        ChatHeaderComponent,
        AvatarComponent,
        LoginComponent,
        RegisterComponent,
        AlertComponent
    ],
    imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, ReactiveFormsModule ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
