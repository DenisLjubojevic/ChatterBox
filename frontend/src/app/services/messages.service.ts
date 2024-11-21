import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, retry, throwError} from "rxjs";
import {Message} from "../models/Message";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {ModelRequest} from "../models/ModelRequest";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  baseUrl = 'http://localhost:8080'
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  getMessagesByChatName(chatName: any): Observable<any>{
    return this.http
      .get<Message[]>(
        this.baseUrl + '/message/chat/' + chatName
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  sendMessage(data: ModelRequest): Observable<Message>{
    return this.http.post<Message>(
      this.baseUrl + '/message/send',
      JSON.stringify(data),
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorHandl));
  }

  sendMessageToFriend(data: ModelRequest, friendUsername: string):Observable<Message>{
    return this.http
      .post<Message>(
        this.baseUrl + "/sendFriend/" + friendUsername,
        JSON.stringify(data),
        this.httpOptions
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
