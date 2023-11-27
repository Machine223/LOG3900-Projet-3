import { Component } from '@angular/core';
import { ChatEventDispatcherService } from './chat/chat-event-dispatcher.service';
import { GameEventDispatcherService } from './game/event-dispatchers/game-event-dispatcher.service';
import { StrokeEventDispatcherService } from './game/event-dispatchers/stroke-event-dispatcher.service';
import { GameroomEventDispatcherService } from './gameroom/gameroom-event-dispatcher.service';
import { ThemeService } from './profile/theme.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    /* tslint:disable */
    constructor(
        private chatEventDispatcherService: ChatEventDispatcherService,
        private strokeEventDispatcherService: StrokeEventDispatcherService,
        private gameroomEventDispatcherService: GameroomEventDispatcherService,
        private gameEventDispatcherService: GameEventDispatcherService,
        public themeService: ThemeService,
    ) {}
}
