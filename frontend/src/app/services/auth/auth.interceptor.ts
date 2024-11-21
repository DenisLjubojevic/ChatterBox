import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {catchError, Observable, switchMap, throwError} from 'rxjs';
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {jwtDecode} from "jwt-decode";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token){
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime && !this.isRefreshing){
        console.log("Token has expired, refreshing token...");
        this.isRefreshing = true;
        return this.authService.getRefreshToken().pipe(
          switchMap(response => {
            this.isRefreshing = false;
            if (response){
              localStorage.setItem('token', response.accessToken);
              localStorage.setItem('refreshToken', response.token);
              console.log("Access token", response.accessToken);
              console.log("Refresh token", response.token);

              request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.accessToken}`
                }
              });
            }
            return next.handle(request);
          }),
          catchError(error => {
            this.isRefreshing = false;
            console.error('Refresh token failed:', error);
            return this.logoutUser();
          })
        );
      }
      return next.handle(request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      }));
    }
    console.log("Handeling ", request);
    return next.handle(request);
  }

  private logoutUser():Observable<HttpEvent<any>>{
    console.error('user is being logged out...');
    localStorage.clear();
    this.router.navigate(['/login']);
    return throwError(() => new Error('Session expired, user logged out.'));
  }
}
