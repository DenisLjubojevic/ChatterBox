import { Component } from '@angular/core';
import {ChatRoomsServiceService} from "../../../services/chat-rooms-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {switchMap} from "rxjs";
import {Users} from "../../../models/Users";
import {ChatRoom} from "../../../models/ChatRoom";
import {UserService} from "../../../services/user.service";
import {ConfirmDialogComponent} from "../../confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {FriendSearchComponent} from "../../Profile/friend-search/friend-search.component";

@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.component.html',
  styleUrls: ['./chat-details.component.css']
})
export class ChatDetailsComponent {
  chatRoom :any;
  isEditMode: boolean = false;
  currentUser: Users | null = null;

  changedFile: File | null = null;
  originalChatData:any = {};
  previewImage: string | null = null;

  constructor(private chatService: ChatRoomsServiceService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) {
    const chatRoomId = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    if (chatRoomId){
      this.chatService.getChatRoomById(chatRoomId).subscribe(chatRoom => {
        this.chatRoom = chatRoom;
      })
    }

    const currentUser: string | null = localStorage.getItem('currentUser');
    if (currentUser){
      userService.getUserByUsername(currentUser).subscribe(data => {
        this.currentUser = data;
      })
    }
  }

  isCreator(){
    if (this.currentUser){
      return this.currentUser.name == this.chatRoom.createdBy.name;
    }
    return false;
  }

  saveChanges(){
    if (this.changedFile){
      console.log(this.changedFile);
      this.chatService.uploadChatPicture(this.chatRoom.id, this.changedFile).pipe(
        switchMap((pfpUrl: string) => {
          console.log(pfpUrl);
          this.chatRoom.pictureUrl = pfpUrl;
          this.changedFile = null;
          this.previewImage = null;

          const updatedChat: ChatRoom = this.chatRoom;
          return this.chatService.updateChat(updatedChat.id, updatedChat);
        })
      ).subscribe(res => {
        console.log(res);
        this.isEditMode = false;
      });
    }else{
      const updatedChat: ChatRoom = this.chatRoom;
      this.chatService.updateChat(updatedChat.id, updatedChat).subscribe(res => {
        console.log(res);
        this.isEditMode = false;
      });
    }
  }

  toggleEditMode(){
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode){
      this.originalChatData = {...this.chatRoom};
    }
  }

  cancelEdit(){
    this.chatRoom = {...this.originalChatData};
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

  inviteFriends(inviteMode: boolean = true, chatId: number = this.chatRoom.id){
    const dialogRef = this.dialog.open(FriendSearchComponent, {
      width: '600px',
      height: '450px',
      data: { inviteMode, chatId }
    });

    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
    })
  }

  leaveGroup(){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "300px",
      data: {
        title: 'Are you sure?',
        message: 'Do you really want to leave this group?',
        isConfirm: true,
        confirmText: 'Yes',
        cancelText: 'No'
      }
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res && this.currentUser){
        this.chatService.leaveChatRoom(this.currentUser.id, this.chatRoom.id).subscribe(data => {
          console.log('Left chat:', data);

          const successDialog = this.dialog.open(ConfirmDialogComponent, {
            width: "300px",
            data: {
              title: 'Left chat',
              message: data,
              isConfirm: false,
              okText: 'OK'
            }
          })

          successDialog.afterClosed().subscribe(() => {
            this.router.navigate(["/chat"]);
          });
        })
      }else{
        console.log("Action canceled by the user");
      }
    })
  }

  deleteChatRoom() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "300px",
      data: {
        title: 'Are you sure?',
        message: 'Do you really want to delete this group?',
        isConfirm: true,
        confirmText: 'Yes',
        cancelText: 'No'
      }
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res){
        console.log("DELETING...");
        this.chatService.deleteChatRoom(this.chatRoom.id).subscribe(() => {
          this.router.navigate(["/chat"]);
        });
      }else{
        console.log("Action canceled by the user");
      }
    })
  }

}
