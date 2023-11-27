import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ConstantsRepositoryService {
    // Tools name
    readonly PENCIL_TOOL: string = 'pencil';
    readonly ERASER_TOOL: string = 'eraser';
    readonly GRID_TOOL: string = 'grid';
    readonly UNDO_TOOL: string = 'undo';
    readonly REDO_TOOL: string = 'redo';

    // Tools option
    readonly INVALID_POSITION: number = Number.MIN_SAFE_INTEGER;

    readonly GRID_MAX_SQUARE_SIZE: number = 200;
    readonly GRID_MIN_SQUARE_SIZE: number = 20;
    readonly GRID_SHORTCUT_INCREMENT: number = 5;

    readonly INITIAL_ERASER_SIZE: number = 50;

    readonly DEFAULT_PENCIL_THICKNESS: number = 1;

    // Key Codes
    readonly C_KEY: string = 'c';
    readonly E_KEY: string = 'e';
    readonly G_KEY: string = 'g';
    readonly Y_KEY: string = 'y';
    readonly Z_KEY: string = 'z';

    // Mouse buttons
    readonly LEFT_MOUSE_BUTTON_ID: number = 0;
    readonly RIGHT_MOUSE_BUTTON_ID: number = 2;

    // Special UIDs
    readonly INVALID_UID: number = -1;
    readonly INITIAL_UID: number = 0;

    // Dimension helpers
    readonly LATERAL_BAR_WIDTH: number = 275;
    readonly PANEL_WIDTH: number = 225;
    readonly NULL_SCROLL: number = 0;

    // Colors
    readonly WHITE_COLOR: string = '#FFFFFF';
    readonly BLACK_COLOR: string = '#000000';
    readonly MAX_USED_COLORS = 10;

    // Undefined items
    readonly UNDEFINED_ICON_NAME: string = 'undefinedIcon';

    // Socket events
    readonly CHANNEL_NEW_EVENT: string = 'channel_new';
    readonly CHANNEL_ADD_USER: string = 'channel_add_user';
    readonly CHANNEL_REMOVE_USER: string = 'channel_remove_user';
    readonly CHANNEL_DELETE_EVENT: string = 'channel_delete';
    readonly CHAT_MESSAGE_NEW_EVENT: string = 'chat_message_new';

    readonly DRAW_NEW_ELEMENT: string = 'draw_new_element';
    readonly DRAW_NEW_COORDS: string = 'draw_new_coords';
    readonly DRAW_DELETE_ELEMENT: string = 'draw_delete_element';
    readonly DRAW_UNDELETE_ELEMENT: string = 'draw_undelete_element';
    readonly DRAW_EDIT_BACKGROUND: string = 'draw_edit_background';

    readonly GAMEROOM_NEW: string = 'gameroom_new';
    readonly GAMEROOM_ADD_USER: string = 'gameroom_add_user';
    readonly GAMEROOM_REMOVE_USER: string = 'gameroom_remove_user';
    readonly GAMEROOM_DELETE: string = 'gameroom_delete';

    readonly GAME_START: string = 'game_start';
    readonly GAME_END: string = 'game_end';
    readonly TURN_INFO: string = 'turn_info';
    readonly TURN_START: string = 'turn_start';
    readonly TURN_END: string = 'turn_end';
    readonly GOOD_GUESS: string = 'good_guess';
    readonly BAD_GUESS: string = 'bad_guess';
    readonly WORD_CHOICE: string = 'word_choice';
    readonly NEW_SCORE: string = 'new_score';
    readonly ATTEMPT_CONSUMED: string = 'attempt_consumed';
    readonly HINT_ASKED: string = 'hint_asked';

    readonly ZOOM_USER_CONNECTED: string = 'zoom_user_connected';
    readonly ZOOM_USER_DISCONNECTED: string = 'zoom_user_disconnected';

    // Chat values
    readonly GENERAL_CHANNEL_NAME: string = 'General';

    // Avatar values
    readonly AVATAR_IS_LOADING: string = 'Avatar is loading...';

    // Server URI
    readonly URI = 'https://p3-server-v2.herokuapp.com';
    // readonly URI = 'http://localhost:3000';

    // QuickDrawVariables
    readonly QUICKDRAW_SIMPLIFIED_URL: string = 'https://storage.googleapis.com/quickdraw_dataset/full/simplified/';
    readonly QUICKDRAW_RAW_URL: string = 'https://storage.googleapis.com/quickdraw_dataset/full/raw/';
    readonly QUICKDRAW_SIMPLIFIED_DIMENSIONS: number = 256;
    readonly MINIMUM_UNSEEN_DRAWINGS: number = 10;

    // Virtual drawer drawing duration
    readonly EASY_DRAWING_DURATION: number = 55;
    readonly MODERATE_DRAWING_DURATION: number = 50;
    readonly HARD_DRAWING_DURATION: number = 45;

    // Virtual drawer delays
    readonly PREVIEW_DELAY: number = 10;
    readonly MAX_DELAY: number = 200;
    readonly MIN_DELAY: number = 1;

    // Pair creator mode
    readonly INFORMATION_MODE: string = 'Information';
    readonly GENERATION_MODE: string = 'Generation';
    readonly EDIT_MODE: string = 'Edit';
    readonly PREVIEW_MODE: string = 'Preview';

    // Image conversion parameters
    readonly DISTANCE_PATH_POINTS: number = 20;
    readonly PATH_MINIMAL_LENGHT: number = 100;
    readonly IMAGE_PER_PAGE: number = 10;
    readonly MAX_AVAILABLE_IMAGE: number = 100;

    // Gameroom views
    readonly PRE_GAMEROOM_FORM: string = 'PreGameRoomForm';
    readonly GAMEROOM: string = 'Gameroom';

    // Separator char
    readonly SEPARATOR_KEYS_CODES: number[] = [ENTER, COMMA];

    // App navigation ids
    readonly MAIN_MENU: string = 'mainMenu';
    readonly START_GAME: string = 'startGame';
    readonly DRAWING_VIEW: string = 'drawingView';
    readonly PAIR_CREATION: string = 'pairCreation';
    readonly VIRTUAL_DRAWER_TESTER: string = 'virtualDrawerTester';

    // Virtual player
    readonly VIRTUAL_PLAYER_NAMES: Set<string> = new Set<string>([
        'Virtual Vincent',
        'Virtual Simon',
        'Virtual Hakim',
        'Virtual Abderrahim',
        'Virtual Rostyslav',
        'Virtual Xi Chen',
    ]);

    // Electron channels
    readonly USERNAME: string = 'username';
    readonly CHANNEL_INFORMATION: string = 'channel-information';
    readonly CURRENTLY_SELECTED_CHANNEL: string = 'currently-selected-channel';
    readonly THEME: string = 'theme';
}
