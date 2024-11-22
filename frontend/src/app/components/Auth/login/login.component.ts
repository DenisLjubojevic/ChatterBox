import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth/auth.service";
import {Router} from "@angular/router";
import {NotificationService} from "../../../services/auth/notification.service";

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
              private notification: NotificationService) {
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
        this.notification.authentificationMessageSucces("Logged in!", "Successfully logged in redirecting to main page...")
      },
      error: (error) => {
        console.log('Login failed, ' ,error);
        this.router.navigate(['/login']);
        this.loginError = 'Invalid email or password';
      }
    });
  }
}
