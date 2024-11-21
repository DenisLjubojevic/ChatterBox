import {Component, EventEmitter, Output} from '@angular/core';
import {WebSocketService} from "../../services/web-socket.service";

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.css']
})
export class MessageInputComponent {
  messageContent = '';
  @Output() messageSent = new EventEmitter<String>();

  sendMessage(){
    if (this.messageContent.trim()){
      this.messageSent.emit(this.messageContent);
      this.messageContent = '';
    }
  }
}
