import {Component, Inject} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {debounceTime, distinctUntilChanged, of, switchMap} from "rxjs";
import {Users} from "../../../models/Users";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../../confirm-dialog/confirm-dialog.component";
import {ChatRoomsServiceService} from "../../../services/chat-rooms-service.service";
import {ChatRoom} from "../../../models/ChatRoom";

@Component({
  selector: 'app-friend-search',
  templateUrl: './friend-search.component.html',
  styleUrls: ['./friend-search.component.css']
})
export class FriendSearchComponent {
  searchQuery: string = '';
  searchResults: Users[] = [];
  currentUser: Users | null = null;

  friends: Users[] = [];
  isFound: boolean = false;

  constructor(private userService: UserService,
              private chatService: ChatRoomsServiceService,
              private confirmDialog: MatDialog,
              private dialogRef: MatDialogRef<FriendSearchComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {inviteMode: boolean, chatId: number | null }) {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser){
      this.userService.getUserByUsername(currentUser).subscribe(data => {
        this.currentUser = data;

        this.loadFriends();
      });
    }
  }

  loadFriends(){
    if (this.currentUser){
      this.userService.getFriends(this.currentUser.id).subscribe(friends => {
        this.friends = friends;
      });
    }
  }

  handleSearchActions(){
    if (this.data.inviteMode){
      this.onSearchInviteFriends();
    }else{
      this.onSearchAddFriends();
    }
  }

  onSearchAddFriends(){
    of(this.searchQuery).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.userService.searchUsers(query))
    ).subscribe(res => {
      this.searchResults = res;

      if (this.currentUser && res.length != 0){
        const isSelfOnly = res.length === 1 && res[0].name === this.currentUser.name;

        const isAlreadyFriend = res.some(user =>
          this.friends.some(friend => friend.id === user.id)
        );

        this.isFound = !isSelfOnly && !isAlreadyFriend;
      }else{
        this.isFound = false;
      }
    });
  }

  onSearchInviteFriends(){
    of(this.searchQuery).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.userService.searchUsers(query))
    ).subscribe(res => {
      this.searchResults = res;

      if (this.currentUser && res.length != 0 && this.data.chatId){
        const isSelfOnly = res.length === 1 && res[0].name === this.currentUser.name;

        let isAlreadyMember: boolean = false;
        this.chatService.getChatRoomById(this.data.chatId).subscribe(chatRoom => {
          isAlreadyMember = res.some(user =>
            chatRoom.members.some(member => member.id === user.id)
          )

          console.log("member - " + isAlreadyMember);
          this.isFound = !isSelfOnly && !isAlreadyMember;
        })
      }else{
        this.isFound = false;
      }
    });
  }

  handleFriendAction(friend: Users){
    if (this.data.inviteMode){
      this.inviteToChat(friend);
    }else{
      this.addFriend(friend);
    }
  }

  inviteToChat(friend: Users){
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent , {
      width: "300px",
      data: {
        title: 'Are you sure?',
        message: 'Do you really want to invite friend to chat?',
        isConfirm: true,
        confirmText: 'Yes',
        cancelText: 'No'
      }
    })

    dialogRef.afterClosed().subscribe((res) => {
      if (res && this.currentUser && this.data.chatId){
        this.chatService.sendChatInvite(this.currentUser.id, friend.id, this.data.chatId).subscribe(data => {
          console.log('Chat inv sent:', data);
          this.closeDialog();

          const successDialog = this.confirmDialog.open(ConfirmDialogComponent, {
            width: "300px",
            data: {
              title: 'Chat invite',
              message: data,
              isConfirm: false,
              okText: 'OK'
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

  addFriend(friend: Users) {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent , {
      width: "300px",
      data: {
        title: 'Are you sure?',
        message: 'Do you really want to add new friend?',
        isConfirm: true,
        confirmText: 'Yes',
        cancelText: 'No'
      }
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res && this.currentUser){
        this.userService.addFriend(this.currentUser.id, friend.id).subscribe(data => {
          console.log('Friend request sent:', data);
          this.closeDialog();

          const successDialog = this.confirmDialog.open(ConfirmDialogComponent, {
            width: "300px",
            data: {
              title: 'Friend request',
              message: data,
              isConfirm: false,
              okText: 'OK'
            }
          })

          successDialog.afterClosed().subscribe(() => {
            this.closeDialog();
          })
        });
      }else{
        console.log("Action canceled by the user");
      }
    })
  }

  closeDialog(){
    this.dialogRef.close(true);
  }
}
