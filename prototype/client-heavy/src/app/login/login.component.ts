﻿import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatIOService } from '../services/chat-io/chat-io.service';
import { AlertService } from '../services/alert/alert.service';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private chatIOService: ChatIOService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private alertService: AlertService
    ) {}

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit(): void {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;

        if (this.submitted) {
            this.chatIOService.login(this.f.username.value, this.f.password.value);
            this.loading = false;
        }
    }
}
