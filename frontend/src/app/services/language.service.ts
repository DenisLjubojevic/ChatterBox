import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage: string | null = null;

  constructor(private translate: TranslateService) { }

  loadLanguage(language: string): void {
    if (this.currentLanguage === language) {
      return;
    }

    this.translate.use(language).subscribe(() => {
      console.log(`Language changed to: ${language}`);
    });

    this.currentLanguage = language;
  }
}
