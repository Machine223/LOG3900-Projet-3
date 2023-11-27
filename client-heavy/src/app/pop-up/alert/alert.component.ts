import { Component, OnInit } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
    title: string;
    content: string;

    isError: boolean;
    isSuccess: boolean;
    constructor(private snackRef: MatSnackBarRef<AlertComponent>) {}

    ngOnInit(): void {
        this.isError = false;
        this.isSuccess = false;
    }

    onDismiss(): void {
        this.snackRef.dismiss();
    }
}
