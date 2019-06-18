import {Component, OnInit, ViewChild} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';
import { IonSlides } from '@ionic/angular';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {TranslateService} from '@ngx-translate/core';
import {ThemeService} from '../../_services/theme/theme.service';


@Component({
  selector: 'app-slides',
  templateUrl: './slides.page.html',
  styleUrls: ['./slides.page.scss'],
})
export class SlidesPage implements OnInit {
  @ViewChild('slides') slides: IonSlides;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  darkMode: boolean;
  language: string;

  constructor(private storage: Storage, private router: Router, private nativePageTransitions: NativePageTransitions,
              private statusBar: StatusBar, private translateService: TranslateService,
              private themeService: ThemeService) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.statusBar.backgroundColorByHexString("#38c7ef");
    this.getDarkValue();
    this.getLanguage();
  }

  ionViewWillLeave() {
    let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 200,
      slowdownfactor: 1,
      androiddelay: 0,
    };
    this.nativePageTransitions.slide(options);
    this.statusBar.backgroundColorByHexString("#ffffff");
  }

  async finish() {
    await this.storage.set('slidesDone', true);
    this.router.navigateByUrl('/registration');
  }

  next() {
    this.slides.slideTo(1, 400);
  }

  //Switch Light-Dark Theme
  switchTheme() {
    this.darkMode = !this.darkMode;
    this.themeService.enableDarkMode(this.darkMode);
    this.saveToStorage('dark', this.darkMode);
  }

  //Change Language
  changeLanguage() {
    //this.presentLanguageChooserModal();
    let languages = ['en', 'de'];
    for (let i = 0; i < languages.length; i++) {
      if (this.language == languages[i]) {
        if (i < this.language.length - 1) {
          this.language = languages[i + 1];
          this.translateService.use(this.language);
          this.saveToStorage('language', this.language);
          break;
        } else if (i == this.language.length - 1) {
          this.language = languages[0];
          this.translateService.use(this.language);
          this.saveToStorage('language', this.language);
          break;
        }
      }
    }
  }

  async getDarkValue() {
    this.darkMode = await this.storage.get('dark')
  }
  async getLanguage() {
    this.language = await this.storage.get('language')
  }

  async saveToStorage(key: string, value: any) {
    await this.storage.set(key, value);
  }


}
