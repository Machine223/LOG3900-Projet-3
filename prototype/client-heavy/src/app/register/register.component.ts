import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../services/alert/alert.service';
import { ChatIOService } from '../services/chat-io/chat-io.service';


@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private chatIOService: ChatIOService,
        private formBuilder: FormBuilder,
        private alertService: AlertService
    ) { }

    ngOnInit(): void {
        this.registerForm = this.formBuilder.group({
            // firstName: ['', Validators.required],
            // lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit(): void {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;

        if (this.submitted) {
            this.chatIOService.signUp(this.f.username.value, this.f.password.value);
            this.loading = false;
        }
    }
}
