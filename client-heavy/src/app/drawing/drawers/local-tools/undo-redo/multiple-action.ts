import { Action } from './action';

export class MultipleAction extends Action {
    actionList: Action[];
    constructor() {
        super();
        this.actionList = [];
    }

    addAction(action: Action): void {
        this.actionList.push(action);
    }

    undo = () => {
        this.actionList.forEach((action: Action) => {
            action.undo();
        });
    }

    redo = () => {
        this.actionList.forEach((action: Action) => {
            action.redo();
        });
    }
}
