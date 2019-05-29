import { Component } from '@angular/core';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import { PasswordChangerModalPage } from '../../modals/password-changer-modal/password-changer-modal.page';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import {ThemeService} from '../../_services/theme/theme.service';
import {LanguageChooserModalPage} from '../../modals/language-chooser-modal/language-chooser-modal.page';
import {VolumeModalPage} from '../../modals/volume-modal/volume-modal.page';
import {LightModalPage} from '../../modals/light-modal/light-modal.page';
import {first} from 'rxjs/operators';
import {ApiService} from '../../_services/api.service';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  username: string;
  email: string;
  darkMode: boolean = false;
  lightPref: number = 12; //TODO get value from server
  volumePref: number = 50;
  languagePref: string;

  constructor(public modalController: ModalController, private storage: Storage,
              private router: Router, private themeService: ThemeService,
              private alertController: AlertController, private toastController: ToastController,
              private apiService: ApiService,
              private translateService: TranslateService) {
    this.getUserInfo();
    this.getLanguagePref()
  }


  // User Info
  getUserInfo() {
    this.storage.get('user').then(user => {
      this.username = user.username;
      this.email = user.email;
    })
  }

  //Change Password
  changePasswordModal() {
    this.presentPasswordChangerModal();
  }
  async presentPasswordChangerModal() {
    const modal = await this.modalController.create({
      component: PasswordChangerModalPage,
      componentProps: {
        value: 123
      },
      cssClass: 'password-changer-modal'
    });
    return await modal.present();
  }

  //Log Out
  logOut() {
    this.presentAlertConfirm()
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'alert-dialog',
      header: 'Are you sure?',
      message: 'Your preferences are saved, you will need to log in again to use the app',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'Log out',
          handler: () => {
            this.apiService.logOut()
                .pipe(first())
                .subscribe(
                    data => {
                      this.storage.remove('user');
                      this.storage.remove('session');
                      this.storage.remove('access_token');
                      this.router.navigateByUrl('/');
                    },
                    error => {
                      console.log(error);
                    });
          }
        }
      ]
    });
    await alert.present();
  }

  //Change Language
  changeLanguage() {
    this.presentLanguageChooserModal();
  }
  async presentLanguageChooserModal() {
    const modal = await this.modalController.create({
      component: LanguageChooserModalPage,
      componentProps: {
        value: 'en'
      },
      cssClass: 'chooser-modal'
    });

    modal.onDidDismiss().then(value => {
      if (typeof value.data == 'string') {
        this.translateService.use('de');
        this.saveToStorage('language', value.data);
        switch (value.data) {
          case 'en': this.toast("Language set to English!"); break;
          case 'de': this.toast("Sprache als Deutsch gesetzt!"); break;
        }
      }
    });

    return await modal.present();
  }

  //Switch Light-Dark Theme
  switchTheme() {
    this.darkMode = !this.darkMode;
    this.themeService.enableDarkMode(this.darkMode)
  }

  //Choose Volume Preference
  changeVolume() {
    this.presentVolumeChangerModal();
  }
  async presentVolumeChangerModal() {
    const modal = await this.modalController.create({
      component: VolumeModalPage,
      componentProps: {
        value: this.volumePref
      },
      cssClass: 'chooser-modal'
    });

    modal.onDidDismiss().then(value => {
      if (typeof value.data == 'number') {
        this.volumePref = value.data;
        this.toast("Volume preference set to: " + this.volumePref)
      }
    });

    return await modal.present();
  }

  //Choose Light Preference
  changeLight() {
    this.presentLightChangerModal();
  }
  async presentLightChangerModal() {
    const modal = await this.modalController.create({
      component: LightModalPage,
      componentProps: {
        value: this.lightPref
      },
      cssClass: 'chooser-modal'
    });

    modal.onDidDismiss().then(value => {
      if (typeof value.data == 'number') {
        this.lightPref = value.data;

        this.toast("Light preference set to: " + this.lightPref)
      }
    });

    return await modal.present();
  }

  //Toast Handler
  async toast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: "dark",
      keyboardClose: true,
    });
    toast.present();
  }

  async saveToStorage(key, value) {
    await this.storage.set(key, value);
  }

  async getLanguagePref() {
    this.storage.get('language').then(pref => {
      if (typeof pref == 'string') {
        this.languagePref = pref;
        this.translateService.use(this.languagePref);
      } else {
        this.translateService.setDefaultLang('en')
      }
    })
  }

}
