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

  setGreenTheme(){
    localStorage.setItem("theme", "green");
    this.changeTheme("green");
    this.theme.loadTheme("green");
  }

  setBrownTheme(){
    localStorage.setItem("theme", "brown");
    this.changeTheme("brown");
    this.theme.loadTheme("brown");
  }

  setBluePinkTheme(){
    localStorage.setItem("theme", "bluePink");
    this.changeTheme("bluePink");
    this.theme.loadTheme("bluePink");
  }

  setBlackYellowTheme(){
    localStorage.setItem("theme", "blackYellow");
    this.changeTheme("blackYellow");
    this.theme.loadTheme("blackYellow");
  }

  changeTheme(newTheme: string) {
    this.themeColor = newTheme;
    this.themeColorChange.emit(this.themeColor);
  }
}
