import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Subscriber } from 'src/app/helpers/subscriber';
import { StrokeContainerService } from '../../stroke-container/stroke-container.service';
import { Action } from './action';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService extends Subscriber {
    doneModifications: Action[];
    undoneModifications: Action[];
    private onUndoRedoSource = new Subject<void>();
    onUndoRedo = this.onUndoRedoSource.asObservable();

    constructor(private shapeContainer: StrokeContainerService) {
        super();
        this.doneModifications = [];
        this.undoneModifications = [];
        this.subscriptions.push(
            this.shapeContainer.onResetContainer.subscribe(() => {
                this.doneModifications = [];
                this.undoneModifications = [];
            }),
        );
    }

    addNewAction(newAction: Action): void {
        this.doneModifications.push(newAction);
        this.undoneModifications = [];
    }

    undo(): void {
        const lastModification: Action | undefined = this.doneModifications.pop();
        if (lastModification !== undefined) {
            lastModification.undo();
            this.undoneModifications.push(lastModification);
            this.onUndoRedoSource.next();
        }
    }

    redo(): void {
        const lastUndoneModification: Action | undefined = this.undoneModifications.pop();
        if (lastUndoneModification !== undefined) {
            lastUndoneModification.redo();
            this.doneModifications.push(lastUndoneModification);
            this.onUndoRedoSource.next();
        }
    }

    hasRedos(): boolean {
        return this.undoneModifications.length !== 0;
    }

    hasUndos(): boolean {
        return this.doneModifications.length !== 0;
    }
}
