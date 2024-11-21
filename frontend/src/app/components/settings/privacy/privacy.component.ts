import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit{
  @Input() privacySettings!: { showOnlineStatus: boolean; profileVisibility: boolean };
  @Output() privacySettingsChange = new EventEmitter<{ showOnlineStatus: boolean; profileVisibility: boolean }>();

  privacy = { showOnlineStatus: false, profileVisibility: false };

  ngOnInit() {
    console.log(this.privacySettings);
    this.privacy = { ...this.privacySettings };
  }

  emitPrivacySettings() {
    this.privacySettingsChange.emit(this.privacy);
  }
}
