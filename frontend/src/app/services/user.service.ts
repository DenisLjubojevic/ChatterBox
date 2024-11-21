import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, Observable, retry, shareReplay, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Users} from "../models/Users";
import {FriendRequest} from "../models/FriendRequest";
import {WebSocketService} from "./web-socket.service";
import {UserStatusService} from "./user-status.service";
import {UserSettings} from "../models/UserSettings";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = 'http://localhost:8080';
  private profileSource = new BehaviorSubject<Users | null>(null);
  profile$ = this.profileSource.asObservable();

  constructor(private http: HttpClient,
              private statusService: UserStatusService) {  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  getUserStatus(userId: string): string {
    return this.statusService.getUserStatus(userId);
  }

  getUserByUsername(username: string): Observable<Users>{
    return this.http.get<Users>(this.baseUrl + '/user/all/' + username)
      .pipe(retry(1), shareReplay(1), catchError(this.errorHandl));
  }

  getUserById(id: number): Observable<Users>{
    return this.http.get<Users>(this.baseUrl + '/user/userId/' + id)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getUserSettings(userId: number): Observable<UserSettings>{
    return this.http
      .get<UserSettings>(this.baseUrl + "/user/settings/get/" + userId)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  updateUserSettings(settings: UserSettings): Observable<UserSettings> {
    return this.http
      .put<UserSettings>(`${this.baseUrl}/user/settings/update`, settings)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  updateUser(userId: any, data:any): Observable<any>{
    return this.http
      .put<any>(
        this.baseUrl + '/user/update/' + userId,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  updateProfile(profile: Users) {
    this.profileSource.next(profile);
  }

  uploadUserPicture(userId: any, file: File): Observable<any>{
    const data: FormData = new FormData();
    data.append('file', file);

    return this.http
      .post<any>(
        this.baseUrl + '/user/' + userId + '/upload-picture',
        data,
        {
         responseType: 'text' as 'json'
        })
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getFriends(userId: number): Observable<any>{
    return this.http
      .get<any>(this.baseUrl + '/user/' + userId + '/friends')
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getPendingRequests(userId: number): Observable<FriendRequest[]>{
    return this.http
      .get<FriendRequest[]>(
        `${this.baseUrl}/friends/pending?userId=${userId}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  acceptFriendRequest(requestId: number): Observable<string> {
    return this.http
      .post<string>(`${this.baseUrl}/friends/acceptRequest?requestId=${requestId}`,
        {},
        { responseType: 'text' as 'json' }
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  denyFriendRequest(requestId: number): Observable<string> {
    return this.http
      .post<string>(`${this.baseUrl}/friends/denyRequest?requestId=${requestId}`,
        {},
        { responseType: 'text' as 'json' }
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  addFriend(senderId: number, recipientId: number): Observable<string>{
    return this.http
      .post<string>(
        `${this.baseUrl}/friends/sendRequest?senderId=${senderId}&recipientId=${recipientId}`,
        {},
        { responseType: 'text' as 'json' }
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  removeFriend(userId: number, freindId: number): Observable<any>{
    return this.http
      .delete<any>(
        this.baseUrl + '/user/' + userId + '/remove-friend/' + freindId,
        {}
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  searchUsers(query: string): Observable<Users[]>{
    return this.http
      .get<Users[]>(
        this.baseUrl + '/user/search',
        { params: { query } }
      )
      .pipe(retry(1), catchError(this.errorHandl));
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
