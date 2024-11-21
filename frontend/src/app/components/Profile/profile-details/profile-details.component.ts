import {Component} from '@angular/core';
import {Users} from "../../../models/Users";
import {UserService} from "../../../services/user.service";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent {
  user: any;
  isEditMode: boolean = false;

  changedFile: File | null = null;
  originalUserData:any = {};
  previewImage: string | null = null;

  constructor(private userService: UserService) {
    console.log("Getting user...");
    const username = localStorage.getItem('currentUser');
    if (username){
      this.userService.getUserByUsername(username).subscribe(data => {
        this.user = data;
      })
    }
  }

  toggleEditMode(){
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode){
      this.originalUserData = {...this.user};
    }
  }

  saveChanges(){
    if (this.changedFile){
      this.userService.uploadUserPicture(this.user.id, this.changedFile).pipe(
        switchMap((pfpUrl: string) => {
          this.user.pfpUrl = pfpUrl;
          this.changedFile = null;
          this.previewImage = null;

          const updatedUser: Users = this.user;
          return this.userService.updateUser(updatedUser.id, updatedUser);
        })
      ).subscribe(res => {
        this.userService.updateProfile(res);
        this.isEditMode = false;
      });
    }else{
      const updatedUser: Users = this.user;
      this.userService.updateUser(updatedUser.id, updatedUser).subscribe(res => {
        this.userService.updateProfile(res);
        this.isEditMode = false;
      });
    }
  }

  cancelEdit(){
    this.user = {...this.originalUserData};
    this.isEditMode = false;
    this.changedFile = null;
    this.previewImage = null;
  }

  onImageChange(event: any){
    const file = event.target.files[0];

    if (file){
      this.changedFile = file;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.previewImage = event.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

}
