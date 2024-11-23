import { Injectable } from '@angular/core';
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private router: Router,
              private translate:TranslateService) { }

  authentificationMessageSucces(){
    const title = this.translate.instant('notifications.loginSuccessTitle');
    const text = this.translate.instant('notifications.loginSuccessMessage');

    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    }).then(() => {
      this.router.navigate(['/chat'])
    });
  }

  singInMessageSucces(){
    const title = this.translate.instant('notifications.signupSuccessTitle');
    const text = this.translate.instant('notifications.signupSuccessMessage');
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    }).then(() => {
      this.router.navigate(['/login'])
    });
  }

  logoutMessageSucces(){
    const title = this.translate.instant('notifications.logoutSuccessTitle');
    const text = this.translate.instant('notifications.logoutSuccessMessage');
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    }).then(() =>{
      this.router.navigate(['/login'])
    });
  }

  deletedAccountMessage(){
    const title = this.translate.instant('notifications.deleteAccSuccessTitle');
    const text = this.translate.instant('notifications.deleteAccSuccessMessage');
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    }).then(() =>{
      this.router.navigate(['/login'])
    });
  }
}
