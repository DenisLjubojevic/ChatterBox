import { TestBed } from '@angular/core/testing';

import { ChatRoomsServiceService } from './chat-rooms-service.service';

describe('ChatRoomsServiceService', () => {
  let service: ChatRoomsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatRoomsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
