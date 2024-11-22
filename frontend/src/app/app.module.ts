import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatRoomListComponent } from './components/chatRooms/chat-room-list/chat-room-list.component';
import { ChatRoomComponent } from './components/chatRooms/chat-room/chat-room.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { MessageInputComponent } from './components/message-input/message-input.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { LoginComponent } from './components/Auth/login/login.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./services/auth/auth.interceptor";
import { AddChatRoomComponent } from './components/chatRooms/add-chat-room/add-chat-room.component';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from "@angular/material/dialog";
import { SignUpComponent } from './components/Auth/sign-up/sign-up.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ThemesComponent } from './components/settings/themes/themes.component';
import { ClickOutsideDirective } from './components/navbar/click-outside.directive';
import { ProfileDetailsComponent } from './components/Profile/profile-details/profile-details.component';
import { FriendListComponent } from './components/Profile/friend-list/friend-list.component';
import { FriendSearchComponent } from './components/Profile/friend-search/friend-search.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import {MatButtonModule} from "@angular/material/button";
import {MatBadgeModule} from "@angular/material/badge";
import { FriendRequestsComponent } from './components/Profile/friend-requests/friend-requests.component';
import { ChatSearchComponent } from './components/chatRooms/chat-search/chat-search.component';
import { ChatDetailsComponent } from './components/chatRooms/chat-details/chat-details.component';
import { SettingsComponent } from './components/settings/settings/settings.component';
import { PrivacyComponent } from './components/settings/privacy/privacy.component';
import { AccountSettingsComponent } from './components/settings/account-settings/account-settings.component';
import { ChangePasswordDialogComponent } from './components/change-password-dialog/change-password-dialog.component';
import {MatInputModule} from "@angular/material/input";
import { LanguageComponent } from './components/settings/language/language.component';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";

export function HttpLoaderFactory(http: HttpClient){
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    ChatRoomListComponent,
    ChatRoomComponent,
    MessageListComponent,
    MessageInputComponent,
    LoginComponent,
    AddChatRoomComponent,
    SignUpComponent,
    NavbarComponent,
    ThemesComponent,
    ClickOutsideDirective,
    ProfileDetailsComponent,
    FriendListComponent,
    FriendSearchComponent,
    ConfirmDialogComponent,
    FriendRequestsComponent,
    ChatSearchComponent,
    ChatDetailsComponent,
    SettingsComponent,
    PrivacyComponent,
    AccountSettingsComponent,
    ChangePasswordDialogComponent,
    LanguageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatBadgeModule,
    MatInputModule,
    TranslateModule.forRoot(
      {
        loader:{
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        },
        defaultLanguage: 'en'
      }
    )
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
