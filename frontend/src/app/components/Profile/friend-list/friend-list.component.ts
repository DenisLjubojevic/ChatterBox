import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {FriendSearchComponent} from "../friend-search/friend-search.component";
import {ConfirmDialogComponent} from "../../confirm-dialog/confirm-dialog.component";
import {ChatRoomsServiceService} from "../../../services/chat-rooms-service.service";
import {Users} from "../../../models/Users";
import {Router} from "@angular/router";
import {UserSettings} from "../../../models/UserSettings";

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})
export class FriendListComponent implements OnInit{
  friends: Users[] = [];
  userId: number = 1;
  hasFriends: boolean = false;
  currentUser: Users | null = null;

  private friendSettingsCache: { [key: number]: UserSettings } = {};
  private friendStatusCache: { [key: number]: string } = {};

  constructor(private userService: UserService,
              private chatService: ChatRoomsServiceService,
              private dialog: MatDialog,
              private router: Router) {

  }

  ngOnInit() {
    const currentUser: string | null = localStorage.getItem('currentUser');
    if (currentUser){
      this.userService.getUserByUsername(currentUser).subscribe(data => {
        this.userId = data.id;
        this.currentUser = data;
        this.loadFriends();
      })
    }
  }

  loadFriends(){
    this.userService.getFriends(this.userId).subscribe(friends => {
      this.friends = friends;
      this.hasFriends = this.friends.length > 0;

      this.friends.forEach(friend => {
        this.preloadFriendData(friend.id);
      })
    });
  }

  preloadFriendData(friendId: number){
    if (!this.friendSettingsCache[friendId]){
      this.userService.getUserSettings(friendId).subscribe((settings) => {
        this.friendSettingsCache[friendId] = settings;
      });
    }

    if (!this.friendStatusCache[friendId]) {
      const status = this.userService.getUserStatus(friendId.toString());
      this.friendStatusCache[friendId] = status;
    }
  }

  addFriend(inviteMode: boolean = false, chatId: number | null = null){
    const dialogRef = this.dialog.open(FriendSearchComponent, {
      width: '600px',
      height: '450px',
      data: { inviteMode, chatId }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res){
        this.loadFriends();
      }
    })
  }

  openChatWithFriend(friendUsername: string){
    if (this.currentUser){
      this.chatService.getClosedChatRoom(friendUsername).subscribe((chatRoom) => {
          console.log('Chat room retrieved or created:', chatRoom);

          if (chatRoom == null){
            this.chatService.createClosedChatRoom(friendUsername).subscribe(data => {
              console.log("created, redirect...")
              this.router.navigate(['/chat', data.id]);
            })
          }else{
            console.log("redirect...")
            this.router.navigate(['/chat', chatRoom.id]);
          }

        },
        (error) => {
          console.error('Error retrieving chat room:', error);
        }
      )
    }

  }

  removeFriend(friendId: number){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Are you sure?',
        message: 'Do you really want to remove him as your friend?',
        isConfirm: true,
        confirmText: 'Yes',
        cancelText: 'No'
      }
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res){
        this.userService.removeFriend(this.userId, friendId).subscribe(() => {
          this.loadFriends();
        })
      }else{
        console.log("Action canceled by the user");
      }
    })
  }

  isFriendOnline(friendId: number): string{
    const settings = this.friendSettingsCache[friendId];
    if (settings && !settings.showOnlineStatus) {
      return 'blocked';
    }

    const status = this.friendStatusCache[friendId];
    return status === 'online' ? 'online' : 'offline';
  }
}
