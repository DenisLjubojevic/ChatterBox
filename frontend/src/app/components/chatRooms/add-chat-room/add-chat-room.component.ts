import {Component, NgZone, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ChatRoomsServiceService} from "../../../services/chat-rooms-service.service";
import {ChatRoom} from "../../../models/ChatRoom";
import {ChatRoomComponent} from "../chat-room/chat-room.component";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-add-chat-room',
  templateUrl: './add-chat-room.component.html',
  styleUrls: ['./add-chat-room.component.css']
})
export class AddChatRoomComponent{
  nrSelect = 'Public';
  chatRoomForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private dialogRef: MatDialogRef<AddChatRoomComponent>,
              private fb: FormBuilder,
              private chatRoomService: ChatRoomsServiceService) {

    this.chatRoomForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      type: ['public'],
      description: ['', Validators.required, Validators.maxLength(255)],
      createdDate: [''],
      lastMessageTimestamp: [''],
      isMuted: [false],
      isPinned: [false],
      pictureUrl: ['default']
    });
  }


  onFileSelected(event: Event){
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0){
      this.selectedFile = target.files[0];
    }
  }

  submitForm(){
    console.log("ADD Chat");
    if (this.chatRoomForm.invalid) {
      this.chatRoomForm.markAllAsTouched();
      return;
    }

    const chatRoom : ChatRoom = this.chatRoomForm.value;
    if (this.selectedFile){
      console.log("ADD Chat - files selected");
      this.chatRoomService.uploadNewPicture(this.selectedFile).pipe(
        switchMap((chatPictureUrl: string) => {
          console.log("ADD Chat picture url - " + chatPictureUrl);
          chatRoom.pictureUrl = chatPictureUrl;
          return this.chatRoomService.createChatRoom(chatRoom);
        })
      ).subscribe(res => {
        console.log("ADD Chat after - " + res);
        this.dialogRef.close(true);
      })
    }else{
      console.log("ADD Chat - no files selected")
      this.chatRoomService.createChatRoom(chatRoom).subscribe(res => {
        this.dialogRef.close(true);
      })
    }
  }

  close() {
    this.dialogRef.close();
  }
}
