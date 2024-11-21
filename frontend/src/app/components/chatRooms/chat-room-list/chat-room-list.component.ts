import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {ChatRoomsServiceService} from "../../../services/chat-rooms-service.service";
import {ChatRoom} from "../../../models/ChatRoom";
import {UserService} from "../../../services/user.service";
import {Users} from "../../../models/Users";
import {ChatSearchComponent} from "../chat-search/chat-search.component";
import {ConfirmDialogComponent} from "../../confirm-dialog/confirm-dialog.component";
import {ActivatedRoute, Router} from "@angular/router";
import {WebSocketService} from "../../../services/web-socket.service";
import {Message} from "../../../models/Message";
import {MessagesService} from "../../../services/messages.service";
import {ModelRequest} from "../../../models/ModelRequest";
import {Subject, takeUntil} from "rxjs";
import {UserSettings} from "../../../models/UserSettings";

@Component({
  selector: 'app-chat-room-list',
  templateUrl: './chat-room-list.component.html',
  styleUrls: ['./chat-room-list.component.css']
})
export class ChatRoomListComponent implements OnInit, OnDestroy{
  chatRooms: any = [];
  selectedChatRoom?: ChatRoom | null = null;

  selectedRoomDetails: any = null;
  currentUser: Users | null = null;

  chatMembers: Users[] = [];

  messages: Message[] = []
  unreadCounts: { [key: number]: number } = {};

  private unsubscribe$ = new Subject<void>();

  private memberSettingsCache: { [key: number]: UserSettings } = {};
  private memberStatusCache: { [key: number]: string } = {};

  constructor(private chatRoomService: ChatRoomsServiceService,
              private messageService: MessagesService,
              private userService: UserService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private webSocketService: WebSocketService,
              private router: Router
  ) {

  }

  getChatMessages(chatRoomId: number){
    this.chatRoomService.getChatRoomById(chatRoomId).subscribe(chatRoom => {
      this.messageService.getMessagesByChatName(chatRoom.name).subscribe(messages => {
        this.messages = messages;
      })
      this.selectRoom(chatRoom);
    })
  }

  pushModelRequestToMessages(messageModel: ModelRequest){
    this.userService.getUserByUsername(messageModel.senderUsername).subscribe(user => {
      if (this.selectedChatRoom){
        const message = {
          id: 0,
          content: messageModel.messageContent,
          timestamp: messageModel.timestamp,
          user: user,
          chatRoom: this.selectedChatRoom
        }
        this.messages.push(message);
      }
    })
  }

  playAudio(){
    let audio = new Audio();
    audio.src = "../../assets/audio/notification-sound.mp3";
    audio.load();
    audio.play();
  }

  ngOnInit() {
    this.getChatRooms();

    this.webSocketService.onMessageReceived()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((messages: any) =>{
        console.log(messages);
        if (this.selectedChatRoom?.id === messages.data.chatRoomId){
          this.pushModelRequestToMessages(messages.data);
        }else{
          this.unreadCounts = this.webSocketService.getUnreadCounts();
          this.playAudio();
          console.log(this.unreadCounts);
        }
      });


    const username: string | null = localStorage.getItem('currentUser');
    if (username){
      this.userService.getUserByUsername(username) .subscribe(data => {
        this.currentUser = data;
        this.getChatRooms();

        const chatRoomId = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
        if (chatRoomId){
          this.getChatMessages(chatRoomId);
        }
      })
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getChatRooms(){
    if (this.currentUser){
      this.chatRoomService.getUserChatRooms(this.currentUser.id).subscribe(data => {
        this.chatRooms = data.sort((a, b) => {
          const dateA = new Date(a.lastMessageTimestamp.replace(' ', 'T'));
          const dateB = new Date(b.lastMessageTimestamp.replace(' ', 'T'));
          return dateB.getTime() - dateA.getTime();
        })
      });
    }
  }

  getFriendPicture(chatRoom: ChatRoom): string{
    if (chatRoom.members[0].name == this.currentUser?.name){
      return chatRoom.members[1].pfpUrl;
    }else{
      return chatRoom.members[0].pfpUrl;
    }
  }

  getFriendName(chatRoom: ChatRoom):string{
    chatRoom.members.forEach(member => {
      this.preloadMemberData(member.id);
    })

    if (chatRoom.members[0].name == this.currentUser?.name){
      return chatRoom.members[1].name;
    }else{
      return chatRoom.members[0].name;
    }
  }

  preloadMemberData(memberId: number){
    if (!this.memberSettingsCache[memberId]){
      this.userService.getUserSettings(memberId).subscribe((settings) => {
        this.memberSettingsCache[memberId] = settings;
      });
    }

    if (!this.memberStatusCache[memberId]) {
      const status = this.userService.getUserStatus(memberId.toString());
      this.memberStatusCache[memberId] = status;
    }
  }

  isMemberOnline(memberId: number): string{
    const settings = this.memberSettingsCache[memberId];
    if (settings && !settings.showOnlineStatus) {
      return 'blocked';
    }

    const status = this.memberStatusCache[memberId];
    return status === 'online' ? 'online' : 'offline';
  }

  getLastMessageTimestamp(chatRoom: ChatRoom) :string{
    const timestampStr = chatRoom.lastMessageTimestamp;
    const timestamp = new Date(timestampStr.replace(' ', 'T'));

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const formatTime = (date: Date) => `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    if (timestamp.toDateString() === now.toDateString()){
      return `Today at ${formatTime(timestamp)}`;
    }

    if (timestamp.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${formatTime(timestamp)}`;
    }

    return `${String(timestamp.getDate()).padStart(2, '0')}.${String(timestamp.getMonth() + 1).padStart(2, '0')}.${timestamp.getFullYear()} in ${formatTime(timestamp)}`;
  }

  showChatDetails(room: any, event: Event){
    event.stopPropagation();
    this.selectedRoomDetails = room;
    this.chatRoomService.getMembersOfChat(room.id).subscribe(data => {
      this.chatMembers = data;
    })
  }

  closeDetails(){
    this.selectedRoomDetails = null;
  }

  ChatRoomMoreDetails(room: any){
    this.router.navigate(['/chat-details', room.id])
  }

  selectRoom(room: ChatRoom) {
    console.log("CHANGING ROOM...");
    const chatRoomId = room.id;
    localStorage.setItem('currentChat', chatRoomId.toString());

    if (this.selectedChatRoom?.id === room.id) {
      return;
    }

    if (this.selectedChatRoom) {
      this.webSocketService.unsubscribeFromRoom(this.selectedChatRoom.id);
    }

    this.selectedChatRoom = room;

    this.webSocketService.subscribeToRoom(room.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((message) => {
        if (message.chatRoomId === this.selectedChatRoom?.id) {
          this.pushModelRequestToMessages(message);
        }
      });

    this.webSocketService.clearUnreadCount(room.id);
    this.getChatMessages(room.id);
  }

  trackByRoom(index: number, room: ChatRoom): number {
    return room.id;
  }

  joinGroup(){
    const dialogRef = this.dialog.open(ChatSearchComponent, {
      width: '600px',
      height: '450px'
    });

    dialogRef.afterClosed().subscribe(() => this.getChatRooms());
  }
}
