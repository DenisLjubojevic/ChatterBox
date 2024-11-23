import { Component } from '@angular/core';
import {Users} from "../../../models/Users";
import {ChatRoom} from "../../../models/ChatRoom";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ChatRoomsServiceService} from "../../../services/chat-rooms-service.service";
import {debounceTime, distinctUntilChanged, of, switchMap} from "rxjs";
import {AddChatRoomComponent} from "../add-chat-room/add-chat-room.component";
import {ConfirmDialogComponent} from "../../confirm-dialog/confirm-dialog.component";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-chat-search',
  templateUrl: './chat-search.component.html',
  styleUrls: ['./chat-search.component.css']
})
export class ChatSearchComponent {
  searchQuery: string = '';
  searchResults: ChatRoom[] = [];
  currentUser: Users | null = null;

  constructor(private dialog: MatDialog,
              private dialogRef: MatDialogRef<ChatSearchComponent>,
              private chatService: ChatRoomsServiceService,
              private userService: UserService) {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser){
      this.userService.getUserByUsername(currentUser).subscribe(data => {
        this.currentUser = data;
        this.onSearch();
      });
    }

  }

  onSearch(){
    of(this.searchQuery).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.chatService.searchPublicChats(query))
    ).subscribe(res => {
      console.log(res);
      this.searchResults = res;
    });
  }

  joinGroup(chatRoom: ChatRoom){
    const dialogRef = this.dialog.open(ConfirmDialogComponent , {
      width: "300px",
      data: {
        title: 'dialog.title.areYouSure',
        message: 'dialog.title.joinGroup',
        isConfirm: true,
        confirmText: 'dialog.button.confirm',
        cancelText: 'dialog.button.cancel'
      }
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res && this.currentUser){
        this.chatService.joinChatRoom(this.currentUser.id, chatRoom.id).subscribe(data => {
          console.log('Join chat:', data);
          this.closeDialog();

          const successDialog = this.dialog.open(ConfirmDialogComponent, {
            width: "300px",
            data: {
              title: 'dialog.title.joinChat',
              message: 'dialog.message.joinGroup',
              isConfirm: false,
              okText: 'dialog.button.ok'
            }
          })

          successDialog.afterClosed().subscribe(() => {
            this.closeDialog();
          })
        })
      }else{
        console.log("Action canceled by the user");
      }
    })
  }

  openCreateGroup() {
    const dialogRef = this.dialog.open(AddChatRoomComponent, {
      width: '600px',
      height: '450px'
    });

    dialogRef.afterClosed().subscribe(() => this.closeDialog());
  }

  closeDialog(){
    this.dialogRef.close(true);
  }

}
