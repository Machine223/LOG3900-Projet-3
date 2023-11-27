import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscriber } from 'src/app/helpers/subscriber';
import { Theme } from '../../profile-account/theme';
import { ProfileManagerService } from '../../profile-manager.service';
import { INetworkUserProfile } from '../../user-profile/network-user-profile';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./../sign.scss', './sign-up.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SignUpComponent extends Subscriber implements OnInit {
    signUpForm: FormGroup;
    passwordInfo: string;

    constructor(private formBuilder: FormBuilder, private profileManagerService: ProfileManagerService) {
        super();
        this.passwordInfo =
            'Password must be 8-16 characters and include at least: \n · 1 lower case letter \n · 1 upper case letter \n · 1 number';
    }

    ngOnInit(): void {
        this.signUpForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,16}$'))]],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            avatarName: ['', Validators.required],
        });
    }

    get field(): { [key: string]: AbstractControl } {
        return this.signUpForm.controls;
    }

    onSubmit(): void {
        if (this.signUpForm.invalid) {
            return;
        }
        this.signUp();
    }

    onAvatarName(avatarName: string): void {
        this.field.avatarName.setValue(avatarName);
    }

    onEnter(event: Event): void {
        event.preventDefault();
        this.onSubmit();
    }

    private signUp(): void {
        const profile: INetworkUserProfile = {
            username: this.field.username.value,
            password: this.field.password.value,
            firstName: this.field.firstName.value,
            lastName: this.field.lastName.value,
            avatarName: this.field.avatarName.value,
            theme: Theme.Light,
        };
        this.profileManagerService.signUp(profile);
    }
}
