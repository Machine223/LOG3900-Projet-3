export abstract class Action {
    undo: () => void;
    redo: () => void;
}
