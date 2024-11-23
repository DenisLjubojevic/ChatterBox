import {Component, OnInit} from '@angular/core';
import {FriendRequest} from "../../../models/FriendRequest";
import {UserService} from "../../../services/user.service";
import {Users} from "../../../models/Users";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../../confirm-dialog/confirm-dialog.component";
import {ChatInvitation} from "../../../models/ChatInvitation";
import {ChatRoomsServiceService} from "../../../services/chat-rooms-service.service";

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.css']
})
export class FriendRequestsComponent implements OnInit{
  friendRequests: FriendRequest[] = [];
  chatInvites: ChatInvitation[] = [];

  constructor(private userService: UserService,
              private chatService: ChatRoomsServiceService,
              private confirmDialog: MatDialog) {  }

  ngOnInit() {
    this.loadPendingRequests();
    this.loadPendingChatInvitations();
  }

  loadPendingRequests(){
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser){
      this.userService.getUserByUsername(currentUser).subscribe(user => {
        this.userService.getPendingRequests(user.id).subscribe(res => {
          this.friendRequests = res;
        });
      });
    }
  }

  loadPendingChatInvitations(){
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser){
      this.userService.getUserByUsername(currentUser).subscribe(user => {
        this.chatService.getPendingRequests(user.id).subscribe(res => {
          this.chatInvites = res;
        })
      });
    }
  }

  acceptFriendRequest(requestId: number) {
    this.userService.acceptFriendRequest(requestId).subscribe(() => {
      const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
        width: "300px",
        data: {
          title: 'dialog.title.friendRequest',
          message: 'dialog.message.friendRequestAccept',
          isConfirm: false,
          okText: 'dialog.button.ok'
        }
      })

      dialogRef.afterClosed().subscribe(() => {
        this.loadPendingRequests();
      })
    });
  }

  denyFriendRequest(requestId: number) {
    this.userService.denyFriendRequest(requestId).subscribe(() => {
      const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
        width: "300px",
        data: {
          title: 'dialog.title.friendRequest',
          message: 'dialog.message.friendRequestReject',
          isConfirm: false,
          okText: 'dialog.title.ok'
        }
      })

      dialogRef.afterClosed().subscribe(() => {
        this.loadPendingRequests();
      })
    });
  }

  acceptChatInvite(invitationId: number){
    this.chatService.acceptChatInvite(invitationId).subscribe(() => {
      const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
        width: "300px",
        data: {
          title: 'dialog.title.chatInvite',
          message: 'dialog.message.chatInviteAccept',
          isConfirm: false,
          okText: 'dialog.button.ok'
        }
      })

      dialogRef.afterClosed().subscribe(() => {
        this.loadPendingChatInvitations();
      })
    })
  }

  denyChatInvite(invitationId: number){
    this.chatService.denyChatInvite(invitationId).subscribe(() => {
      const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
        width: "300px",
        data: {
          title: 'dialog.title.chatInvite',
          message: 'dialog.title.chatInviteReject',
          isConfirm: false,
          okText: 'dialog.button.ok'
        }
      })

      dialogRef.afterClosed().subscribe(() => {
        this.loadPendingChatInvitations();
      })
    })
  }
}
