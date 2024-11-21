import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {UserSettings} from "../models/UserSettings";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  private settingsSubject = new BehaviorSubject<UserSettings | null>(null);
  settings$ = this.settingsSubject.asObservable();

  constructor(private userService: UserService) { }

  loadUserSettings(username: string){
    this.userService.getUserByUsername(username).subscribe(user => {
      this.userService.getUserSettings(user.id).subscribe(settings => {
        this.settingsSubject.next(settings);
      });
    });
  }

  getUserSettings(): UserSettings | null{
    return this.settingsSubject.getValue();
  }

  updateUserSettings(newSettings: UserSettings){
    this.userService.updateUserSettings(newSettings).subscribe(settings => {
      console.log("updated settings - ");
      console.log(settings);
      this.settingsSubject.next(settings);
    });
  }
}
