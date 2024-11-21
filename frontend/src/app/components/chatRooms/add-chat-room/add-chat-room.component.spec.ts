import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChatRoomComponent } from './add-chat-room.component';

describe('AddChatRoomComponent', () => {
  let component: AddChatRoomComponent;
  let fixture: ComponentFixture<AddChatRoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddChatRoomComponent]
    });
    fixture = TestBed.createComponent(AddChatRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
