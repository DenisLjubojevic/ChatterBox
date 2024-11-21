import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {WebSocketService} from "./web-socket.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserStatusService {
  private userStatuses: { [userId: string]: string } = {};
  private statusSubject = new BehaviorSubject<{ [userId: string]: string }>({});
  public statusUpdates$ = this.statusSubject.asObservable();

  constructor(private http: HttpClient,
              private webSocketService: WebSocketService) {
    this.getAllUserStatuses().subscribe((statuses) => {
      this.userStatuses = statuses;
      this.statusSubject.next({ ...this.userStatuses });
    })

    this.webSocketService.onStatusUpdate().subscribe((statusUpdate) => {
      this.userStatuses[statusUpdate.userId] = statusUpdate.status;
      this.statusSubject.next({ ...this.userStatuses });
    });
  }

  getUserStatus(userId: string): string {
    return this.userStatuses[userId] || 'offline';
  }
  getAllUserStatuses(): Observable<{ [userId: string]: string }> {
    return this.http
      .get<{ [userId: string]: string }>('http://localhost:8080/user/status/all');
  }
}
