import {Component, Inject} from '@angular/core';
import {DialogRef} from "@angular/cdk/dialog";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent {
  user:any;

  constructor(private dialogRef: DialogRef<ProfileViewComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.user = data.user;
  }

  closeView(){
    this.dialogRef.close();
  }

}
