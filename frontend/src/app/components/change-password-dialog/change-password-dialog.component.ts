import { Component } from '@angular/core';
import {UserService} from "../../services/user.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent {
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private userService: UserService,
              private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
              private dialog: MatDialog
  ) {  }

  changePassword(){
    if (this.newPassword == this.confirmPassword){
      const dialogRef = this.dialog.open(ConfirmDialogComponent , {
        width: "300px",
        data: {
          title: 'Are you sure?',
          message: 'Do you really want to change your password?',
          isConfirm: true,
          confirmText: 'Yes',
          cancelText: 'No'
        }
      })

      dialogRef.afterClosed().subscribe(res => {
        if (res){
          this.userService.changePassword(this.newPassword).subscribe(res => {
            console.log(res);
          });

          const successDialog = this.dialog.open(ConfirmDialogComponent, {
            width: "300px",
            data: {
              title: 'Password change',
              message: 'You have successfully changed your password!',
              isConfirm: false,
              okText: 'OK'
            }
          })

          successDialog.afterClosed().subscribe(() => {
            this.dialogRef.close();
          })
        }
      })
    }
  }
}
