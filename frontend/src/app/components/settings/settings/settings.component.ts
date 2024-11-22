import {Component, OnInit} from '@angular/core';
import {UserSettingsService} from "../../../services/user-settings.service";
import {ConfirmDialogComponent} from "../../confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit{
  userSettings: any = null;
  isSettingsLoaded = false;

  constructor(private userSettingsService: UserSettingsService,
              private confirmDialog: MatDialog) {  }

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
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent , {
      width: "300px",
      data: {
        title: 'dialog.title.areYouSure',
        message: 'dialog.message.updateTheme',
        isConfirm: true,
        confirmText: 'dialog.button.confirm',
        cancelText: 'dialog.button.cancel'
      }
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res){
        this.userSettings.themeColor = newTheme;

        const successDialog = this.confirmDialog.open(ConfirmDialogComponent, {
          width: "300px",
          data: {
            title: 'dialog.title.themeChange',
            message: 'dialog.title.confirmTheme',
            isConfirm: false,
            okText: 'dialog.title.ok'
          }
        })

        successDialog.afterClosed().subscribe(() => {
          console.log("updated theme - " + newTheme);
          console.log(this.userSettings)
        })
      }
    })
  }

  updateLanguage(newLanguage: string){
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent , {
      width: "300px",
      data: {
        title: 'Are you sure?',
        message: 'Do you really want to change your language?',
        isConfirm: true,
        confirmText: 'Yes',
        cancelText: 'No'
      }
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res){
        this.userSettings.language = newLanguage;

        const successDialog = this.confirmDialog.open(ConfirmDialogComponent, {
          width: "300px",
          data: {
            title: 'Language change',
            message: 'You have selected a new language, to confirm it click on save all button!',
            isConfirm: false,
            okText: 'OK'
          }
        })

        successDialog.afterClosed().subscribe(() => {
          console.log("updated language - " + newLanguage);
          console.log(this.userSettings)
        })
      }
    })
  }

  updatePrivacySettings(newPrivacy: { showOnlineStatus: boolean; profileVisibility: boolean }) {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent , {
      width: "300px",
      data: {
        title: 'Are you sure?',
        message: 'Do you really want to update your privacy settings?',
        isConfirm: true,
        confirmText: 'Yes',
        cancelText: 'No'
      }
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res){
        this.userSettings.showOnlineStatus = newPrivacy.showOnlineStatus;
        this.userSettings.profileVisibility = newPrivacy.profileVisibility;

        const successDialog = this.confirmDialog.open(ConfirmDialogComponent, {
          width: "300px",
          data: {
            title: 'Privacy settings change',
            message: 'You have updated your privacy settings, to confirm it click on save all button!',
            isConfirm: false,
            okText: 'OK'
          }
        })

        successDialog.afterClosed().subscribe(() => {
          console.log("updated privacy - " + newPrivacy);
          console.log(this.userSettings)
        })
      }
    })
  }

  saveAllSettings() {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent , {
      width: "300px",
      data: {
        title: 'Are you done?',
        message: 'Do you want to save all your changes?',
        isConfirm: true,
        confirmText: 'Yes',
        cancelText: 'No'
      }
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res){
        this.userSettingsService.updateUserSettings(this.userSettings);

        const successDialog = this.confirmDialog.open(ConfirmDialogComponent, {
          width: "300px",
          data: {
            title: 'All settings saved',
            message: 'You have saved all of your settings!',
            isConfirm: false,
            okText: 'OK'
          }
        })

        successDialog.afterClosed().subscribe(() => {
          console.log("SAVING SETTINGS...");
          console.log(this.userSettingsService.getUserSettings());
        })
      }
    })
  }

}
