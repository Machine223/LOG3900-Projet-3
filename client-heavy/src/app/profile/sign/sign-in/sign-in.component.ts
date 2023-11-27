import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileManagerService } from '../../profile-manager.service';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss', './../sign.scss'],
})
export class SignInComponent implements OnInit {
    signInForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private profileManagerService: ProfileManagerService) {}

    ngOnInit(): void {
        this.signInForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    get field(): { [key: string]: AbstractControl } {
        return this.signInForm.controls;
    }

    onSubmit(): void {
        if (this.signInForm.invalid) {
            return;
        }
        this.signIn();
    }

    private signIn(): void {
        this.profileManagerService.signIn(this.field.username.value, this.field.password.value);
    }
}
