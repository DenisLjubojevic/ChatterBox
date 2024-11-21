import { Injectable } from '@angular/core';
import Swal from "sweetalert2";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private router: Router) { }

  authentificationMessageSucces(title: string, text: string){
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

  singInMessageSucces(title: string, text: string){
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

  logoutMessageSucces(title: string, message: string){
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    }).then(() =>{
      this.router.navigate(['/login'])
    });
  }
}
