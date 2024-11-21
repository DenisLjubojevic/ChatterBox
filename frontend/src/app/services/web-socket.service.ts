import { Injectable } from '@angular/core';
import {Observable, Subject, Subscription} from "rxjs";
import { Stomp } from '@stomp/stompjs';
import SockJS from "sockjs-client";
import {ModelRequest} from "../models/ModelRequest";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  public stompClient :any;
  private messageSubject: Subject<ModelRequest> = new Subject<ModelRequest>();
  private statusSubject = new Subject<{ userId: string; status: string }>();

  private unreadCounts: { [chatRoomId: number]: number } = {};
  private roomSubscriptions: { [chatRoomId: number]: Subscription } = {};
  constructor(private http: HttpClient) {
    this.connect();
  }

  connect() {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      console.log('WebSocket connected');

      this.stompClient.subscribe(`/topic/user-status`, (message: any) => {
        const parsedMessage = JSON.parse(message.body);
        this.statusSubject.next(parsedMessage);
      });
    });


    /*this.stompClient.connect({}, () => {
      console.log('WebSocket connected');
      this.stompClient.subscribe('/topic/messages', (message: any) => {
        const parsedMessage = JSON.parse(message.body);
        this.messageSubject.next(parsedMessage);
        this.incrementUnreadCount(parsedMessage.data.chatRoomId);
      });
    });*/
  }

  getUserStatus(userId: string): Observable<string> {
    return this.http.get<string>(`http://localhost:8080/user/status/${userId}`);
  }

  onStatusUpdate(): Observable<{ userId: string; status: string}>{
    return this.statusSubject.asObservable();
  }

  subscribeToRoom(chatRoomId: number): Observable<ModelRequest> {
    if (this.roomSubscriptions[chatRoomId]) {
      console.log(`Already subscribed to room ${chatRoomId}`);
      return this.messageSubject.asObservable();
    }

    const subscription = this.stompClient.subscribe(`/topic/messages`, (message: any) => {
      const parsedMessage = JSON.parse(message.body);
      this.messageSubject.next(parsedMessage);
      this.incrementUnreadCount(parsedMessage.data.chatRoomId);
    });

    this.roomSubscriptions[chatRoomId] = subscription;
    return this.messageSubject.asObservable();
  }

  unsubscribeFromRoom(chatRoomId: number) {
    if (this.roomSubscriptions[chatRoomId]) {
      this.roomSubscriptions[chatRoomId].unsubscribe();
      delete this.roomSubscriptions[chatRoomId];
      console.log(`Unsubscribed from room ${chatRoomId}`);
    }
  }

  onMessageReceived(): Observable<ModelRequest> {
    return this.messageSubject.asObservable();
  }

  incrementUnreadCount(chatRoomId: number) {
    if (!this.unreadCounts[chatRoomId]) {
      this.unreadCounts[chatRoomId] = 0;
    }

    const retriveChatRoomId = Number(localStorage.getItem('currentChat'));
    console.log(retriveChatRoomId);
    if (retriveChatRoomId !== chatRoomId){
      this.unreadCounts[chatRoomId]++;
    }
  }

  clearUnreadCount(chatRoomId: number) {
    console.log("Clearing for chat - " + chatRoomId);
    this.unreadCounts[chatRoomId] = 0;
  }

  getUnreadCounts(): { [chatRoomId: number]: number } {
    console.log("Getting for chat - ");
    return this.unreadCounts;
  }

  sendMessage(message: ModelRequest) {
    this.stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(message),
    });
  }
}
