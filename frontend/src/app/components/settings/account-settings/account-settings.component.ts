import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../../services/user.service";
import {ChangePasswordDialogComponent} from "../../change-password-dialog/change-password-dialog.component";
import {ConfirmDialogComponent} from "../../confirm-dialog/confirm-dialog.component";
import {AuthService} from "../../../services/auth/auth.service";
import {NotificationService} from "../../../services/auth/notification.service";

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent {

  constructor(private dialog: MatDialog,
              private userService: UserService,
              private authService: AuthService,
              private notification: NotificationService) {
  }

  openChangePasswordDialog(){
    this.dialog.open(ChangePasswordDialogComponent);
  }

  requestAccountDeletion(){
    const dialogRef = this.dialog.open(ConfirmDialogComponent , {
      width: "300px",
      data: {
        title: 'Are you sure?',
        message: 'Do you really want to delete your account?',
        isConfirm: true,
        confirmText: 'Yes',
        cancelText: 'No'
      }
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res){
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          this.userService.deleteAccount().subscribe({
            next: () => {
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('token');
              localStorage.removeItem('currentUser');
              this.notification.logoutMessageSucces(
                "Account deleted!",
                "Your account has been successfully deleted!"
              );
            },
            error: (error) => {
              console.error("Account deletion failed:", error);
            }
          });
        } else {
          console.error("Refresh token not found. Cannot delete account.");
        }
      }else{
        console.log("Cancel delete");
      }
    })
  }

}
