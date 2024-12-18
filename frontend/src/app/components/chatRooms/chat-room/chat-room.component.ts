import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Message} from "../../../models/Message";
import {ChatRoom} from "../../../models/ChatRoom";
import {WebSocketService} from "../../../services/web-socket.service";
import {UserService} from "../../../services/user.service";
import {MessagesService} from "../../../services/messages.service";
import {ModelRequest} from "../../../models/ModelRequest";
import {Subscription} from "rxjs";
import {ChatRoomsServiceService} from "../../../services/chat-rooms-service.service";

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent{
  @Input() messages: Message[] = [];
  @Input() chatRoom!: ChatRoom;

  @Input() allMessagesLoaded: boolean = false;

  @Output() loadOlderMessages = new EventEmitter<void>();

  constructor(private webSocketService: WebSocketService,
              private userSrevice: UserService) {
  }

  loadMessages(){
    this.loadOlderMessages.emit();
  }

  handleMessage(content: any){
    if (!content || content.trim() === '') return;

    const currentUser = localStorage.getItem('currentUser');
    if (currentUser){
      this.userSrevice.getUserByUsername(currentUser).subscribe(user => {
        const messageModel: ModelRequest = {
          chatRoomId: this.chatRoom.id,
          senderUsername: user.name,
          messageContent: content,
          timestamp: new Date().toISOString(),
        };

        this.webSocketService.sendMessage(messageModel);
      })
    }
  }
}
