import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ChatRoomsServiceService} from "../../../services/chat-rooms-service.service";
import {ChatRoom} from "../../../models/ChatRoom";
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
    if (this.chatRoomForm.invalid) {
      this.chatRoomForm.markAllAsTouched();
      return;
    }

    const chatRoom : ChatRoom = this.chatRoomForm.value;
    if (this.selectedFile){
      this.chatRoomService.uploadNewPicture(this.selectedFile).pipe(
        switchMap((chatPictureUrl: string) => {
          chatRoom.pictureUrl = chatPictureUrl;
          return this.chatRoomService.createChatRoom(chatRoom);
        })
      ).subscribe(res => {
        this.dialogRef.close(true);
      })
    }else{
      this.chatRoomService.createChatRoom(chatRoom).subscribe(res => {
        this.dialogRef.close(true);
      })
    }
  }

  close() {
    this.dialogRef.close();
  }
}
