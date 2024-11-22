import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent {
  @Input() language!: string;
  @Output() languageChange = new EventEmitter<string>();
  constructor(private translate: TranslateService) {  }

  public changeLanguage(language: string){
    this.language = language;
    this.translate.use(language).subscribe(() => {
      console.log("Language change to " + language);
    });
  }

  applyLanguage(){
    this.languageChange.emit(this.language);
  }
}
