import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { AlertComponent } from './alert.component';

@Injectable({
    providedIn: 'root',
})
export class AlertService {
    private snackbarRef: MatSnackBarRef<AlertComponent> | null;

    constructor(private snackbar: MatSnackBar) {
        this.snackbarRef = null;
    }

    openSnackBar(component: ComponentType<any>): MatSnackBarRef<any> {
        return this.snackbar.openFromComponent(component, {
            duration: 1500,
        });
    }

    alertSuccess(title: string, content: string): void {
        if (this.snackbarRef) {
            this.snackbarRef.dismiss();
        }
        this.snackbarRef = this.openSnackBar(AlertComponent);
        this.snackbarRef.instance.title = title;
        this.snackbarRef.instance.content = content;
        this.snackbarRef.instance.isSuccess = true;
    }

    alertError(title: string, content: string): void {
        if (this.snackbarRef) {
            this.snackbarRef.dismiss();
        }
        this.snackbarRef = this.openSnackBar(AlertComponent);
        this.snackbarRef.instance.title = title;
        this.snackbarRef.instance.content = content;
        this.snackbarRef.instance.isError = true;
    }
}
