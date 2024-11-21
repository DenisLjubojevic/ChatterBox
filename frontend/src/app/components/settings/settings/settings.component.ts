import {Component, OnInit} from '@angular/core';
import {UserSettingsService} from "../../../services/user-settings.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit{
  userSettings: any = null;
  isSettingsLoaded = false;

  constructor(private userSettingsService: UserSettingsService) {  }

  ngOnInit() {
    const username = localStorage.getItem("currentUser")
    if (username) {
      const currentSettings = this.userSettingsService.getUserSettings();
      if (currentSettings){
        this.userSettings = { ...currentSettings }
        this.isSettingsLoaded = true;
      }else{
        this.userSettingsService.settings$.subscribe(settings => {
          if (settings) {
            this.userSettings = { ...settings };
            this.isSettingsLoaded = true;
          }
        });
      }
    }
  }

  updateThemeColor(newTheme: string) {
    console.log("updated theme - " + newTheme);
    console.log(this.userSettings)
    this.userSettings.themeColor = newTheme;
  }

  updatePrivacySettings(newPrivacy: { showOnlineStatus: boolean; profileVisibility: boolean }) {
    console.log("updated privacy - " + newPrivacy);
    console.log(this.userSettings)
    this.userSettings.showOnlineStatus = newPrivacy.showOnlineStatus;
    this.userSettings.profileVisibility = newPrivacy.profileVisibility;
  }

  saveAllSettings() {
    console.log("SAVING SETTINGS...");
    this.userSettingsService.updateUserSettings(this.userSettings);
    console.log(this.userSettingsService.getUserSettings());
  }

}
