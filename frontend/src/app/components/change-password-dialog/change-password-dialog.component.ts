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
          title: 'dialog.title.areYouSure',
          message: 'dialog.message.changePassword',
          isConfirm: true,
          confirmText: 'dialog.button.confirm',
          cancelText: 'dialog.button.cancel'
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
              title: 'dialog.title.passChanged',
              message: 'dialog.message.passChanged',
              isConfirm: false,
              okText: 'dialog.button.ok'
            }
          })

          successDialog.afterClosed().subscribe(() => {
            this.dialogRef.close();
          })
        }
      })
    }
  }

  cancelChanges(){
    this.dialogRef.close();
  }
}
