import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import {TranslateService} from '@ngx-translate/core';
import {ThemeService} from './_services/theme/theme.service';
import {ApiService} from './_services/api/api.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  access_token: string;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage : Storage,
    private translateService: TranslateService,
    private themeService: ThemeService,
    private apiService: ApiService
  ) {
    this.initializeApp();
    this.initializeDB();
    this.getLanguagePref();
    this.setTheme();
    this.getUserInfo();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async initializeDB() {
    this.setData('server', 'https://platania.info:3000/api');
  }

  async getLanguagePref() {
    this.storage.get('language').then(pref => {
      if (typeof pref == 'string') {
        this.translateService.use(pref);
      } else {
        this.translateService.setDefaultLang('en')
      }
    })
  }

  async setTheme() {
    this.storage.get('dark').then(dark => {
      if (typeof dark == 'boolean') {
        this.themeService.enableDarkMode(dark);
      } else {
        this.themeService.enableDarkMode(false);
      }
    })
  }

  getUserInfo() {
    this.apiService.getToken().then(data => {
      if (data != null) {
        this.apiService.getUser(data).pipe(first()).subscribe(
            data => {
              this.setData('user', data);
              console.log("User loaded successfully")
            }, err => console.log(err))
      }
    })
  }

  async setData(key, value) {
    await this.storage.set(key, value);
  }

  async getToken() {
    this.access_token = await this.storage.get("access_token")
  }
}
