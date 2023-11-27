import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { NgxElectronModule } from 'ngx-electron';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AngularMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChannelListItemComponent } from './chat/channel/channel-list-item/channel-list-item.component';
import { PromptDeleteChannelComponent } from './chat/channel/channel-list-item/prompt-delete-channel/prompt-delete-channel.component';
import { ChannelListComponent } from './chat/channel/channel-list/channel-list.component';
import { ChannelComponent } from './chat/channel/channel.component';
import { ZoomComponent } from './chat/channel/zoom/zoom.component';
import { ChatMessageComponent } from './chat/chat-message/chat-message.component';
import { ChatViewComponent } from './chat/chat-view/chat-view.component';
import { ChatHeaderComponent } from './chat/composer-view/chat-header/chat-header.component';
import { ComposerComponent } from './chat/composer-view/composer/composer.component';
import { MessageListComponent } from './chat/composer-view/message-list/message-list.component';
import { GeneralChatComponent } from './chat/general-chat/general-chat.component';
import { PrivateChatComponent } from './chat/private-chat/private-chat.component';
import { WindowedChatComponent } from './chat/windowed-chat/windowed-chat.component';
import { EraserComponent } from './drawing/drawers/local-tools/drawing-tools/eraser-tool/eraser/eraser.component';
import { RedRectangleComponent } from './drawing/drawers/local-tools/drawing-tools/eraser-tool/red-rectangle/red-rectangle.component';
import { GridComponent } from './drawing/drawers/local-tools/grid/grid/grid.component';
import { StrokeComponent } from './drawing/drawers/stroke/stroke-component/stroke.component';
import { VirtualDrawerTesterComponent } from './drawing/drawers/virtual-drawer/virtual-drawer-tester/virtual-drawer-tester.component';
import { AttributePanelComponent } from './drawing/drawing-view/attribute-panel/attribute-panel.component';
import { ColorAttributesComponent } from './drawing/drawing-view/attribute-panel/color-attributes/color-attributes.component';
import { ColorToolComponent } from './drawing/drawing-view/attribute-panel/color-attributes/color-tool/color-tool.component';
import { ColorsCanvasComponent } from './drawing/drawing-view/attribute-panel/color-attributes/colors-canvas/colors-canvas.component';
import { ColorChoicesComponent } from './drawing/drawing-view/attribute-panel/color-choices/color-choices.component';
import { EraserAttributesComponent } from './drawing/drawing-view/attribute-panel/eraser-attributes/eraser-attributes.component';
import { GridAttributesComponent } from './drawing/drawing-view/attribute-panel/grid-attributes/grid-attributes.component';
import { PencilAttributesComponent } from './drawing/drawing-view/attribute-panel/pencil-attributes/pencil-attributes.component';
import { DrawingPanelComponent } from './drawing/drawing-view/drawing-panel/drawing-panel.component';
import { DrawingSurfaceComponent } from './drawing/drawing-view/drawing-surface/drawing-surface.component';
import { DrawingDirective } from './drawing/drawing-view/drawing-surface/drawing-surface.directive';
import { LateralBarButtonComponent } from './drawing/drawing-view/lateral-bar-button/lateral-bar-button.component';
import { LateralBarComponent } from './drawing/drawing-view/lateral-bar/lateral-bar.component';
import { AttemptComponent } from './game/game-view-parts/attempt/attempt.component';
import { GuessBoxComponent } from './game/game-view-parts/guess-box/guess-box.component';
import { HintComponent } from './game/game-view-parts/hint/hint.component';
import { LeaderboardItemComponent } from './game/game-view-parts/leaderboard/leaderboard-item/leaderboard-item.component';
import { LeaderboardComponent } from './game/game-view-parts/leaderboard/leaderboard.component';
import { PlayerAnswerCounterItemComponent } from './game/game-view-parts/player-answer-counter/player-answer-counter-item/player-answer-counter-item.component';
import { PlayerAnswerCounterComponent } from './game/game-view-parts/player-answer-counter/player-answer-counter.component';
import { ScoreboardComponent } from './game/game-view-parts/scoreboard/scoreboard.component';
import { TimerComponent } from './game/game-view-parts/timer/timer.component';
import { TitleBoxComponent } from './game/game-view-parts/title-box/title-box.component';
import { EndGameViewComponent } from './game/game-views/end-game-view/end-game-view.component';
import { FreeForAllViewComponent } from './game/game-views/free-for-all-view/free-for-all-view.component';
import { SprintViewComponent } from './game/game-views/sprint-view/sprint-view.component';
import { WordChoiceComponent } from './game/word-choice/word-choice.component';
import { GameLobbyComponent } from './gameroom/gameroom-view/game-lobby/game-lobby.component';
import { LobbyAddVirtualComponent } from './gameroom/gameroom-view/game-lobby/lobby-add-virtual/lobby-add-virtual.component';
import { LobbyPlayerComponent } from './gameroom/gameroom-view/game-lobby/lobby-player/lobby-player.component';
import { GameroomListItemComponent } from './gameroom/gameroom-view/gameroom-list/gameroom-list-item/gameroom-list-item.component';
import { GameroomListComponent } from './gameroom/gameroom-view/gameroom-list/gameroom-list.component';
import { GameroomViewComponent } from './gameroom/gameroom-view/gameroom-view.component';
import { PreGameroomFormComponent } from './gameroom/gameroom-view/pre-gameroom-form/pre-gameroom-form.component';
import { MainMenuComponent } from './navigation/main-menu/main-menu.component';
import { TopBarComponent } from './navigation/top-bar/top-bar.component';
import { AlertComponent } from './pop-up/alert/alert.component';
import { AvatarPickerComponent } from './profile/avatar/avatar-picker/avatar-picker.component';
import { SafeHtmlPipe } from './profile/avatar/avatar-picker/safe-html.pipe';
import { AvatarComponent } from './profile/avatar/avatar.component';
import { AvatarService } from './profile/avatar/avatar.service';
import { ProfileAccountComponent } from './profile/profile-account/profile-account.component';
import { ProfileHistoryDateComponent } from './profile/profile-history/profile-history-item/profile-history-date/profile-history-date.component';
import { ProfileHistoryGameComponent } from './profile/profile-history/profile-history-item/profile-history-game/profile-history-game.component';
import { ProfileHistoryItemComponent } from './profile/profile-history/profile-history-item/profile-history-item.component';
import { ProfileHistorySessionComponent } from './profile/profile-history/profile-history-item/profile-history-session/profile-history-session.component';
import { ProfileHistoryComponent } from './profile/profile-history/profile-history.component';
import { ProfileStatsComponent } from './profile/profile-stats/profile-stats.component';
import { ProfileComponent } from './profile/profile.component';
import { SignInComponent } from './profile/sign/sign-in/sign-in.component';
import { SignUpComponent } from './profile/sign/sign-up/sign-up.component';
import { PromptTutorialComponent } from './tutorial/prompt-tutorial/prompt-tutorial.component';
import { PairCreationViewComponent } from './word-image-pair/pair-creation-view/pair-creation-view.component';
import { ConversionViewComponent } from './word-image-pair/pair-creation-view/pair-generation/converter-process/conversion-view/conversion-view.component';
import { ConverterProcessComponent } from './word-image-pair/pair-creation-view/pair-generation/converter-process/converter-process.component';
import { ImageCropperComponent } from './word-image-pair/pair-creation-view/pair-generation/converter-process/image-cropper/image-cropper.component';
import { ImportGenerationComponent } from './word-image-pair/pair-creation-view/pair-generation/import-generation/import-generation.component';
import { ManualGenerationComponent } from './word-image-pair/pair-creation-view/pair-generation/manual-generation/manual-generation.component';
import { OnlineSearchGenerationComponent } from './word-image-pair/pair-creation-view/pair-generation/online-search-generation/online-search-generation.component';
import { OnlineSearchItemComponent } from './word-image-pair/pair-creation-view/pair-generation/online-search-generation/online-search-item/online-search-item.component';
import { PairGenerationComponent } from './word-image-pair/pair-creation-view/pair-generation/pair-generation.component';
import { QuickDrawGenerationComponent } from './word-image-pair/pair-creation-view/pair-generation/quick-draw-generation/quick-draw-generation.component';
import { QuickdrawManagerService } from './word-image-pair/pair-creation-view/pair-generation/quick-draw-generation/quickdraw-manager.service';
import { PairInformationComponent } from './word-image-pair/pair-creation-view/pair-information/pair-information.component';
import { PairPreviewComponent } from './word-image-pair/pair-creation-view/pair-preview/pair-preview.component';

const initializer = {
    provide: APP_INITIALIZER,
    useFactory: (avatarService: AvatarService, quickDrawManager: QuickdrawManagerService) => () => {
        avatarService.getAllAvatars();
        quickDrawManager.resetDrawings();
    },
    deps: [AvatarService, QuickdrawManagerService],
    multi: true,
};

@NgModule({
    declarations: [
        AppComponent,
        DrawingSurfaceComponent,
        LateralBarComponent,
        AttributePanelComponent,
        LateralBarButtonComponent,
        ColorAttributesComponent,
        PencilAttributesComponent,
        EraserAttributesComponent,
        GridAttributesComponent,
        ColorToolComponent,
        ColorsCanvasComponent,
        StrokeComponent,
        EraserComponent,
        RedRectangleComponent,
        GridComponent,
        DrawingDirective,
        ChannelListComponent,
        ChannelComponent,
        ChatMessageComponent,
        ChatViewComponent,
        ChannelListItemComponent,
        ChatHeaderComponent,
        MessageListComponent,
        ComposerComponent,
        AvatarComponent,
        SignInComponent,
        SignUpComponent,
        ZoomComponent,
        AlertComponent,
        AvatarPickerComponent,
        SafeHtmlPipe,
        PairCreationViewComponent,
        PairInformationComponent,
        PairGenerationComponent,
        ManualGenerationComponent,
        ImportGenerationComponent,
        QuickDrawGenerationComponent,
        OnlineSearchGenerationComponent,
        MainMenuComponent,
        PreGameroomFormComponent,
        GameroomViewComponent,
        GameroomListComponent,
        GameroomListItemComponent,
        GameLobbyComponent,
        PrivateChatComponent,
        TopBarComponent,
        PairPreviewComponent,
        VirtualDrawerTesterComponent,
        ProfileComponent,
        LobbyPlayerComponent,
        LobbyAddVirtualComponent,
        ConverterProcessComponent,
        ImageCropperComponent,
        ConversionViewComponent,
        DrawingPanelComponent,
        TimerComponent,
        ScoreboardComponent,
        ColorChoicesComponent,
        AttemptComponent,
        HintComponent,
        GuessBoxComponent,
        TitleBoxComponent,
        SprintViewComponent,
        FreeForAllViewComponent,
        WordChoiceComponent,
        LeaderboardComponent,
        PlayerAnswerCounterComponent,
        PlayerAnswerCounterItemComponent,
        LeaderboardItemComponent,
        GeneralChatComponent,
        WindowedChatComponent,
        ProfileStatsComponent,
        ProfileHistoryComponent,
        ProfileHistoryItemComponent,
        ProfileHistorySessionComponent,
        ProfileHistoryGameComponent,
        ProfileAccountComponent,
        ProfileHistoryDateComponent,
        PromptTutorialComponent,
        OnlineSearchItemComponent,
        EndGameViewComponent,
        PromptDeleteChannelComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AngularMaterialModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AngularMaterialModule,
        ImageCropperModule,
        NgxElectronModule,
    ],
    providers: [initializer],
    entryComponents: [StrokeComponent, AlertComponent, WordChoiceComponent, EndGameViewComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}
