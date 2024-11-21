import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {NotificationService} from "../../services/auth/notification.service";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {Users} from "../../models/Users";
import {ChatRoomsServiceService} from "../../services/chat-rooms-service.service";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  isSidebarOpen = false;
  currentUser: any;

  pendingRequestsCount: number = 0;
  pendingFriendRequests: number = 0;
  pendingChatInvitations: number = 0;

  constructor(private authService: AuthService,
              private notification: NotificationService,
              private router: Router,
              private userService: UserService,
              private chatService: ChatRoomsServiceService) {
    const username: string | null = localStorage.getItem('currentUser');
    this.getUser(username);

    this.fetchPendingRequests();
  }

  getUser(username: any){
    if (username){
      this.userService.getUserByUsername(username).subscribe(data => {
        this.currentUser = data;
      });
    }
  }

  ngOnInit() {
    this.userService.profile$.subscribe(updatedProfile => {
      if (updatedProfile){
        this.currentUser = updatedProfile;
      }
    })

    setInterval(() => {
      this.fetchPendingRequests();
    }, 30000);
  }

  fetchPendingRequests(){
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser){
      this.userService.getUserByUsername(currentUser).subscribe(user => {
        this.userService.getPendingRequests(user.id).pipe(
          switchMap((res) => {
            this.pendingFriendRequests = res.length;
            return this.chatService.getPendingRequests(user.id);
          })
        ).subscribe(res => {
          this.pendingChatInvitations = res.length;
          this.pendingRequestsCount = this.pendingFriendRequests + this.pendingChatInvitations;
        })

      });
    }
  }

  viewPendingRequests() {
    this.router.navigate(['/friend-requests']);
  }

  toggleSidebar(event: Event){
    event.stopPropagation();
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(){
    this.isSidebarOpen = false;
  }

  openProfile(){
    this.router.navigate(['/profile-details']);
  }

  openChat(){
    this.router.navigate(['/chat']);
  }

  openSettings(){
    this.router.navigate(['/settings']);
  }

  logout(){
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken){
      this.authService.logout(refreshToken).subscribe({
        next:() => {
          this.notification.logoutMessageSucces("Logged out!", "Successfully logged out redirecting to login...")
        },
        error: (error) => {
          console.log(error);
        }
      });
    }

  }
}
