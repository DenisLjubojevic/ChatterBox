import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, filter, Observable, retry, throwError} from "rxjs";
import {ChatRoom} from "../models/ChatRoom";
import {Users} from "../models/Users";
import {ChatInvitation} from "../models/ChatInvitation";

@Injectable({
  providedIn: 'root'
})
export class ChatRoomsServiceService {
  baseUrl = 'https://chatterbox-production-3863.up.railway.app'
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  getChatRoomById(chatId: number): Observable<ChatRoom>{
    return this.http
      .get<ChatRoom>(this.baseUrl + '/chat/id/' + chatId)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getUserChatRooms(userId: number): Observable<ChatRoom[]>{
    return this.http
      .get<ChatRoom[]>(this.baseUrl + "/chat/user/" + userId)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getMembersOfChat(userId: any): Observable<Users[]>{
    return this.http
      .get<Users[]>(this.baseUrl + '/chat/' + userId + '/members')
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getClosedChatRoom(recipientUsername: string): Observable<any>{
    return this.http
      .get<any>(
        `${this.baseUrl}/chat/closed/${recipientUsername}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  createChatRoom(data: any): Observable<ChatRoom>{
    return this.http
      .post<ChatRoom>(
        this.baseUrl + '/chat/create',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  createClosedChatRoom(friendUsername: string): Observable<ChatRoom>{
    return this.http
      .post<ChatRoom>(
        this.baseUrl + '/chat/create-closed/' + friendUsername,
        {}
      )
      .pipe(retry(1), catchError(this.errorHandl));

  }

  joinChatRoom(userId:number, chatRoomId: number): Observable<string>{
    const params = new HttpParams().set('userId', userId.toString())

    return this.http
      .post<string>(
        this.baseUrl + '/chat/' + chatRoomId + '/join',
        {},
        { params, responseType: 'text' as 'json' }
      ).pipe(retry(1), catchError(this.errorHandl));
  }

  leaveChatRoom(userId: number, chatRoomId: number): Observable<string>{
    const params = new HttpParams().set('userId', userId.toString());

    return this.http
      .post<string>(
        this.baseUrl + '/chat/' + chatRoomId + '/leave',
        {},
        { params, responseType: 'text' as 'json' }
      ).pipe(retry(1), catchError(this.errorHandl));
  }

  searchPublicChats(query: string): Observable<ChatRoom[]>{
    return this.http
      .get<ChatRoom[]>(
        this.baseUrl + '/chat/search',
        { params: { query } }
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  updateChat(chatId: any, data: any): Observable<any>{
    return this.http
      .put<any>(
        this.baseUrl + '/chat/update/' + chatId,
        JSON.stringify(data),
        this.httpOptions
      ).pipe(retry(1), catchError(this.errorHandl));
  }

  uploadChatPicture(chatId: any, file: File): Observable<any>{
    const data = new FormData();
    data.append('file', file);

    return this.http
      .post<any>(
        this.baseUrl + '/chat/' + chatId + '/upload-picture',
        data,
        {
          responseType: 'text' as 'json'
        })
      .pipe(retry(1), catchError(this.errorHandl));
  }

  uploadNewPicture(file: File): Observable<any>{
    const data = new FormData();
    data.append('file', file);

    return this.http
      .post<any>(
        this.baseUrl + '/chat/new-picture',
        data,
        {
          responseType: 'text' as 'json'
        })
      .pipe(retry(1), catchError(this.errorHandl));
  }

  deleteChatRoom(id: any){
    return this.http
      .delete(this.baseUrl + '/chat/delete/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getPendingRequests(userId :number):Observable<ChatInvitation[]>{
    return this.http
      .get<ChatInvitation[]>(
        `${this.baseUrl}/chat-invitation/pending?userId=${userId}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  acceptChatInvite(inviteId: number): Observable<string>{
    return this.http
      .post<string>(
        `${this.baseUrl}/chat-invitation/acceptInvitation?invitationId=${inviteId}`,
        {},
        { responseType: "text" as "json"}
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  denyChatInvite(inviteId: number): Observable<string>{
    return this.http
      .post<string>(
        `${this.baseUrl}/chat-invitation/denyInvitation?invitationId=${inviteId}`,
        {},
        { responseType: "text" as "json"}
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  sendChatInvite(senderId: number, recipientId: number, chatId: number):Observable<string>{
    return this.http
      .post<string>(
        `${this.baseUrl}/chat-invitation/sendInvitation?senderId=${senderId}&recipientId=${recipientId}&chatId=${chatId}`,
        {},
        { responseType: "text" as "json"}
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
