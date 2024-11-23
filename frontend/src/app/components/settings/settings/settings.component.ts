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
            okText: 'dialog.button.ok'
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
        title: 'dialog.title.areYouSure',
        message: 'dialog.message.updateLanguage',
        isConfirm: true,
        confirmText: 'dialog.button.confirm',
        cancelText: 'dialog.button.cancel'
      }
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res){
        this.userSettings.language = newLanguage;

        const successDialog = this.confirmDialog.open(ConfirmDialogComponent, {
          width: "300px",
          data: {
            title: 'dialog.title.languageChange',
            message: 'dialog.message.confirmLanguage',
            isConfirm: false,
            okText: 'dialog.button.ok'
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
        title: 'dialog.title.areYouSure',
        message: 'dialog.message.updatePrivacy',
        isConfirm: true,
        confirmText: 'dialog.button.confirm',
        cancelText: 'dialog.button.cancel'
      }
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res){
        this.userSettings.showOnlineStatus = newPrivacy.showOnlineStatus;
        this.userSettings.profileVisibility = newPrivacy.profileVisibility;

        const successDialog = this.confirmDialog.open(ConfirmDialogComponent, {
          width: "300px",
          data: {
            title: 'dialog.title.privacyChange',
            message: 'dialog.message.confirmPrivacy',
            isConfirm: false,
            okText: 'dialog.button.ok'
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
        title: 'dialog.title.saveAll',
        message: 'dialog.message.saveAll',
        isConfirm: true,
        confirmText: 'dialog.button.confirm',
        cancelText: 'dialog.button.cancel'
      }
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res){
        this.userSettingsService.updateUserSettings(this.userSettings);

        const successDialog = this.confirmDialog.open(ConfirmDialogComponent, {
          width: "300px",
          data: {
            title: 'dialog.title.allSaved',
            message: 'dialog.message.allSaved',
            isConfirm: false,
            okText: 'dialog.button.ok'
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
