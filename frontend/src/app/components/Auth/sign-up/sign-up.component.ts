import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth/auth.service";
import {Router} from "@angular/router";
import {NotificationService} from "../../../services/auth/notification.service";
import {Users} from "../../../models/Users";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signupForm: FormGroup;
  signupError: string = "";

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private notification: NotificationService,
              private router: Router,
              private translate: TranslateService){
    var friends: Users[]  = [];

    this.signupForm = this.fb.group({
      name: ["", Validators.required],
      pass: ["", Validators.required],
      email: ["", Validators.email],
      displayedName: ["", Validators.required],
      pfpUrl: ["https://example.com/pfp.jpg"],
      isOnline: [false],
      lastSeen: [""],
      role: ["user"],
      friends: [friends]
    });
  }

  signUp(){
    this.signupError = '';
    if (this.signupForm.invalid){
      this.signupError = this.translate.instant('invalid.signUp');
      return;
    }

    this.authService.signup(this.signupForm.value).subscribe((res) => {
      this.notification.singInMessageSucces();
    })
  }

  goBack(){
    this.router.navigate(['/login']);
  }
}
