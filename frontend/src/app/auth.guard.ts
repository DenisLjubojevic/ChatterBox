import { CanActivate, Router,} from '@angular/router';
import {Injectable} from "@angular/core";
import {AuthService} from "./services/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(private authService: AuthService, private router: Router) {  }

  canActivate(): boolean {
     if (this.authService.getToken()){
       console.log("Can get in...");
       return true;
     }else{
       console.log("Forbidden...");
       this.router.navigate(['/login']);
       return false;
     }
  }
}
