import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import {TranslateService} from '@ngx-translate/core';
import {ThemeService} from './_services/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage : Storage,
    private translateService: TranslateService,
    private themeService: ThemeService
  ) {
    this.initializeApp();
    this.initializeDB();
    this.getLanguagePref();
    this.setTheme();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    ;
  }
  async initializeDB() {
    await this.storage.set('server', 'https://platania.info:3000/api')
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
      }
    })
  }
}
