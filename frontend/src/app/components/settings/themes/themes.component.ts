import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ThemesService} from "../../../services/themes.service";

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.css']
})
export class ThemesComponent {
  @Input() themeColor!: string;
  @Output() themeColorChange = new EventEmitter<string>();
  constructor(private theme: ThemesService) { }

  previewTheme(newTheme: string){
    this.themeColor = newTheme;
    this.theme.loadTheme(newTheme);
  }

  applyTheme() {
    this.themeColorChange.emit(this.themeColor);
  }
}
