import { Component, EventEmitter, Output } from '@angular/core';
import { ChatWindowService } from 'src/app/chat/chat-window.service';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { DialogService } from 'src/app/pop-up/dialog/dialog.service';
import { ProfileManagerService } from 'src/app/profile/profile-manager.service';
import { PromptTutorialComponent } from 'src/app/tutorial/prompt-tutorial/prompt-tutorial.component';
import { ViewOptionsService } from '../view-options.service';

@Component({
    selector: 'app-main-menu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent {
    @Output() newNavigation: EventEmitter<string>;

    constructor(
        private constants: ConstantsRepositoryService,
        private profileManager: ProfileManagerService,
        private chatWindow: ChatWindowService,
        private viewOptions: ViewOptionsService,
        private dialogService: DialogService,
    ) {
        this.newNavigation = new EventEmitter();
    }

    onStartGame(): void {
        this.newNavigation.emit(this.constants.START_GAME);
    }

    onTutorial(): void {
        this.dialogService.openDialog(PromptTutorialComponent);
    }

    onPairCreation(): void {
        this.newNavigation.emit(this.constants.PAIR_CREATION);
    }

    onVirtualDrawerTester(): void {
        this.newNavigation.emit(this.constants.VIRTUAL_DRAWER_TESTER);
    }

    onQuit(): void {
        this.chatWindow.closeChatWindow();
        this.profileManager.signOut();
        this.viewOptions.isChatSideNavOpened = false;
    }
}
