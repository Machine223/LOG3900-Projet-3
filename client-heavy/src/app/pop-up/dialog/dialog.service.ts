import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    constructor(private dialog: MatDialog) {}

    openDialog(component: ComponentType<any>, disableClose: boolean = true): MatDialogRef<any> {
        return this.dialog.open(component, {
            autoFocus: false,
            disableClose,
        });
    }
}
