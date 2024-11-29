import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable, retry, tap, throwError} from "rxjs";
import {Users} from "../../models/Users";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://chatterbox-production-3863.up.railway.app/auth/api';
  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  login(username: string, password: string): Observable<any>{
    console.log("Login called from frontend!");
    return this.http.post<any>(`${this.apiUrl}/login`, {username, password}).pipe(
      tap(response => {
        console.log(response);
        if (response && response.accessToken && response.token){
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('refreshToken', response.token);
          localStorage.setItem('currentUser', username);

          console.log("Access token - ", response.accessToken);
          console.log("Refresh token - ", response.token);
          console.log('currentUser - ', username);
          this.tokenSubject.next(response.accesToken);
        }
        return response;
      })
    );
  }

  signup(data: Users):Observable<Users>{
    console.log("Sign in called from frontend!");
    return this.http
      .post<Users>(
        `https://chatterbox-production-3863.up.railway.app/user/create`,
        JSON.stringify(data),
        this.httpOptions
        ).pipe(retry(1), catchError(this.errorHandl));
  }

  getToken(): string | null{
    return localStorage.getItem('token');
  }

  logout(refreshToken: string){
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${refreshToken}`
    };

    return this.http.post<any>(`${this.apiUrl}/logout`, { token: refreshToken }, { headers })
      .pipe(
        tap({
          next: () => {
            this.clearAuthState();
          },
          error: (error) => {
            console.log("Error during logout. Clearing tokens locally.", error);
            this.clearAuthState();
          }
        })
      );
  }

  clearAuthState(){
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.tokenSubject.next(null);
  }

  getRefreshToken(): Observable<any>{
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken){
      console.log('No refresh token found...')
      return throwError(() => new Error('No refresh token found...'));
    }

    const body = {refreshToken: refreshToken};

    return this.http.post<any>(`${this.apiUrl}/refreshToken`, body).pipe(
      tap(response => {
        if (response && response.token){
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('refreshToken', response.token);
        }
      })
    );
  }

  getAuthHeaders(){
    const token = this.getToken();
    return token ? {headers: new HttpHeaders({ 'Authorization': `Bearer ${token}`}) } : {};
  }

  errorHandl(error: any){
    let errorMessage = '';
    if (error.error instanceof ErrorEvent){
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
