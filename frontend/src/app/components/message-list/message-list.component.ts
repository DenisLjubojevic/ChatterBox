import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef, EventEmitter,
  Input,
  OnChanges, OnDestroy, Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Message} from "../../models/Message";
import {formatDate} from "@angular/common";
import {UserService} from "../../services/user.service";
import {Users} from "../../models/Users";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnChanges, AfterViewChecked{
  @Input() messageList: Message[] = [];
  @Input() allMessagesLoaded: boolean = false;
  @ViewChild('messageListContainer') private messageListContainer!:ElementRef;

  @Output() loadOlderMessages = new EventEmitter<void>();

  private shouldAutoScroll: boolean = true;
  public currentUser: Users | null = null;
  constructor(private userService: UserService,
              private translate: TranslateService) {
    const currentUser: string | null = localStorage.getItem('currentUser');
    if (currentUser){
      this.userService.getUserByUsername(currentUser).subscribe(foundUser => {
        this.currentUser = foundUser;
      })
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messageList'] && this.messageList){
      this.messageList.sort((a, b) => {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      })
    }

    this.shouldAutoScroll = true;
    if (this.shouldScroll()){
      this.scrollToBottom();
    }
  }

  loadMore(){
    const container = this.messageListContainer.nativeElement;

    const currentScrollHeight = container.scrollHeight;
    const currentScrollTop = container.scrollTop;

    this.shouldAutoScroll = false;
    this.loadOlderMessages.emit();

    setTimeout(() => {
      const newScrollHeight = container.scrollHeight;
      container.scrollTop = newScrollHeight - currentScrollHeight + currentScrollTop;
    }, 100);

  }


  ngAfterViewChecked() {
    if (this.shouldAutoScroll){
      this.scrollToBottom();
    }
  }

  scrollToBottom(){
    try{
      this.messageListContainer.nativeElement.scrollTop = this.messageListContainer.nativeElement.scrollHeight
    }catch (error){
      console.log("Scroll failed - ", error);
    }
  }

  shouldScroll(){
    const {scrollTop, scrollHeight, clientHeight} = this.messageListContainer.nativeElement;
    return this.shouldAutoScroll = scrollTop + clientHeight >= scrollHeight - 50;
  }

  getFormattedDate(timestamp: string): string{
    const messageDate = new Date(timestamp);
    const today = new Date();

    if (messageDate.toDateString() == today.toDateString()){
      return this.translate.instant('dialog.message.messageToday');
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()){
      return this.translate.instant('dialog.message.messageYesterday');
    }

    return formatDate(messageDate, 'dd.MM.yyyy', 'en-US');
  }


}
