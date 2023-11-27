import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatViewComponent } from './chat/chat-view/chat-view.component';
import { WindowedChatComponent } from './chat/windowed-chat/windowed-chat.component';
import { SignInComponent } from './profile/sign/sign-in/sign-in.component';
import { SignUpComponent } from './profile/sign/sign-up/sign-up.component';

const routes: Routes = [
    { path: '', redirectTo: '/main', pathMatch: 'full' },
    { path: 'signin', component: SignInComponent },
    { path: 'signup', component: SignUpComponent },
    { path: 'main', component: ChatViewComponent },
    { path: 'chat', component: WindowedChatComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
