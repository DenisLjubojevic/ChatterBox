import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ThemesService} from "./services/themes.service";
import {UserSettingsService} from "./services/user-settings.service";
import {LanguageService} from "./services/language.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'chatterbox-frontend';
  showNavbar = true;

  constructor(private router: Router,
              private theme: ThemesService,
              private languageService: LanguageService,
              private userSettingsService: UserSettingsService) {  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      const username = localStorage.getItem("currentUser")
      if (username) {
        this.userSettingsService.loadUserSettings(username);

        this.userSettingsService.settings$.subscribe(settings => {
          if (settings) {
            this.theme.loadTheme(settings.themeColor);
            this.languageService.loadLanguage(settings.language);
          }
        });
      }

      if (this.router.url == '/login' || this.router.url == '/signUp'){
        this.showNavbar = false;
      }else{
        this.showNavbar = true;
      }
    });
  }
}
