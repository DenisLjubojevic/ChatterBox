import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class ThemesService {
  private currentTheme: string | null = null;
  constructor(@Inject(DOCUMENT) private document: Document) { }

  loadTheme(themeName: string){

    const head = this.document.getElementsByTagName('head')[0];
    const themeSrc = this.document.getElementById('client-theme') as HTMLLinkElement;

    if (this.currentTheme === themeName) {
      return;
    }

    if (themeSrc){
      themeSrc.href = `${themeName}.css`;
    }else{
      const style = this.document.createElement('link');
      style.id = 'client-theme';
      style.rel = 'stylesheet';
      style.href = `${themeName}.css`;

      head.appendChild(style);
    }

    this.currentTheme = themeName;
  }
}
