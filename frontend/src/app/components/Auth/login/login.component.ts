import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth/auth.service";
import {Router} from "@angular/router";
import {NotificationService} from "../../../services/auth/notification.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = "";

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private notification: NotificationService,
              private translate: TranslateService) {
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  signUp(){
    this.router.navigate(['/signUp']);
  }

  login(){
    this.loginError = '';
    this.authService.login(
      this.loginForm.get('username')?.value,
      this.loginForm.get('password')?.value
    ).subscribe({
      next: () => {
        this.notification.authentificationMessageSucces();
      },
      error: (error) => {
        console.log('Login failed, ' ,error);
        this.router.navigate(['/login']);
        this.loginError = this.translate.instant('invalid.login');
      }
    });
  }
}
