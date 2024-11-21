import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRoomListComponent } from './chat-room-list.component';

describe('ChatRoomListComponent', () => {
  let component: ChatRoomListComponent;
  let fixture: ComponentFixture<ChatRoomListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatRoomListComponent]
    });
    fixture = TestBed.createComponent(ChatRoomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
