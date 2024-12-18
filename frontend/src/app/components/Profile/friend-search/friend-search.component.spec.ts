import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendSearchComponent } from './friend-search.component';

describe('FriendSearchComponent', () => {
  let component: FriendSearchComponent;
  let fixture: ComponentFixture<FriendSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendSearchComponent]
    });
    fixture = TestBed.createComponent(FriendSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
