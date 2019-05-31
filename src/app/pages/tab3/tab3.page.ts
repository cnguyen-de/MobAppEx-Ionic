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
import {ApiService} from '../../_services/api/api.service';
import {TranslateService} from '@ngx-translate/core';
import {CheckoutModalPage} from '../../modals/checkout-modal/checkout-modal.page';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  username: string;
  email: string;
  darkMode: boolean;
  lightPref: number = 0;
  volumePref: number = 0;

  constructor(public modalController: ModalController, private storage: Storage,
              private router: Router, private themeService: ThemeService,
              private alertController: AlertController, private toastController: ToastController,
              private apiService: ApiService,
              private translateService: TranslateService) {
    this.getUserInfo();
    this.getDarkValue();
  }

  // User Info
  getUserInfo() {
    this.storage.get('user').then(user => {
      this.username = user.username;
      this.email = user.email;
      if (user.capsulePreference != null) {
        this.lightPref = user.capsulePreference.LightLevel;
        this.volumePref = user.capsulePreference.VolumenLevel;
      }
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
                      this.apiService.logOutLocally();
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
        this.translateService.use(value.data);
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
    this.themeService.enableDarkMode(this.darkMode);
    this.saveToStorage('dark', this.darkMode);
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

  checkout() {
    this.presentCheckOutModal();
  }
  async presentCheckOutModal() {
    const modal = await this.modalController.create({
      component: CheckoutModalPage,
      componentProps: {
        value: '10.05'
      },
      cssClass: 'chooser-modal'
    });

    modal.onDidDismiss().then(value => {
      if (typeof value.data == 'number') {
        console.log(value.data);
        //this.toast("Light preference set to: " + this.lightPref)
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
      cssClass: 'toast-container',
      keyboardClose: true,
    });
    toast.present();
  }

  async saveToStorage(key, value) {
    await this.storage.set(key, value);
  }

  async getDarkValue() {
    this.darkMode = await this.storage.get('dark')
  }

}
