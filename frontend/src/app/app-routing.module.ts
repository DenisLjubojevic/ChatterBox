import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatRoomListComponent} from "./components/chatRooms/chat-room-list/chat-room-list.component";
import {AuthGuard} from "./auth.guard";
import {LoginComponent} from "./components/Auth/login/login.component";
import {SignUpComponent} from "./components/Auth/sign-up/sign-up.component";
import {ProfileDetailsComponent} from "./components/Profile/profile-details/profile-details.component";
import {FriendRequestsComponent} from "./components/Profile/friend-requests/friend-requests.component";
import {ChatDetailsComponent} from "./components/chatRooms/chat-details/chat-details.component";
import {SettingsComponent} from "./components/settings/settings/settings.component";

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'login'},
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'settings', component: SettingsComponent},
  { path: 'chat', component: ChatRoomListComponent, canActivate: [AuthGuard] },
  { path: 'chat/:id', component: ChatRoomListComponent, canActivate: [AuthGuard] },
  { path: 'chat-details/:id', component: ChatDetailsComponent, canActivate: [AuthGuard] },
  { path: 'profile-details', component: ProfileDetailsComponent, canActivate: [AuthGuard] },
  { path: 'friend-requests', component: FriendRequestsComponent, canActivate: [AuthGuard] }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
