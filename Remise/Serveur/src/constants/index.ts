export const SOCKET = Object.freeze({
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    CHAT_MESSAGE_NEW: 'chat_message_new',
    CHANNEL_NEW: 'channel_new',
    CHANNEL_DELETE: 'channel_delete',
    CHANNEL_ADD_USER: 'channel_add_user',
    CHANNEL_REMOVE_USER: 'channel_remove_user',
    DRAW_NEW_ELEMENT: 'draw_new_element',
    DRAW_NEW_COORDS: 'draw_new_coords',
    DRAW_DELETE_ELEMENT: 'draw_delete_element',
    DRAW_UNDELETE_ELEMENT: 'draw_undelete_element',
    DRAW_EDIT_BACKGROUND: 'draw_edit_background',
    GAMEROOM_NEW: 'gameroom_new',
    GAMEROOM_ADD_USER: 'gameroom_add_user',
    GAMEROOM_REMOVE_USER: 'gameroom_remove_user',
    GAMEROOM_DELETE: 'gameroom_delete',
    GAME_START: 'game_start',
    GAME_END: 'game_end',
    TURN_INFO: 'turn_info',
    TURN_START: 'turn_start',
    TURN_END: 'turn_end',
    GOOD_GUESS: 'good_guess',
    BAD_GUESS: 'bad_guess',
    NEW_SCORE: 'new_score',
    ATTEMPT_CONSUMED: 'attempt_consumed',
    WORD_CHOICE: 'word_choice',
    HINT_ASKED: 'hint_asked',
    ZOOM_JOIN_ROOM: 'zoom_join_room',
    ZOOM_USER_CONNECTED: 'zoom_user_connected',
    ZOOM_USER_DISCONNECTED: 'zoom_user_disconnected',
});

export const GENERAL_CHANNEL = 'General';

export const VIRTUAL_PLAYER_NAMES: Set<string> = new Set<string>([
    'Virtual Vincent',
    'Virtual Simon',
    'Virtual Hakim',
    'Virtual Abderrahim',
    'Virtual Rostyslav',
    'Virtual Xi Chen',
]);

export const enum GAME_MODES {
    FREE_FOR_ALL = 0,
    SPRINT_SOLO,
    SPRINT_COOP,
}

export const GAME_CONSTANTS = Object.freeze({
    TURN_DURATION_SECONDS: 60,
    TURN_DURATION_SECONDS_SUB: 10,
    TURN_MESSAGE_COUNTDOWN_SECONDS: 10,
    TURN_WINNING_SCORE: 100,
    TURN_WINNING_SCORE_SUB: 10,
    N_ATTEMPTS: 3,
    N_ATTEMPTS_SUB: 1,
});

export const VIRTUAL_CHAT_DELAY = 1000;

export const VIRTUAL_CHAT_PERSONALIZE_PROBABILITY = 0.25;
