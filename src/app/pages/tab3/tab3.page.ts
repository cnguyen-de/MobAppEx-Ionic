import { Component } from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import { PasswordChangerModalPage } from '../../modals/password-changer-modal/password-changer-modal.page';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import {ThemeService} from '../../_services/theme/theme.service';
import {LanguageChooserModalPage} from '../../modals/language-chooser-modal/language-chooser-modal.page';
import {VolumeModalPage} from '../../modals/volume-modal/volume-modal.page';
import {LightModalPage} from '../../modals/light-modal/light-modal.page';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  username: string;
  email: string;
  darkMode: boolean = false;
  constructor(public modalController: ModalController, private storage: Storage,
              private router: Router, private themeService: ThemeService,
              private alertController: AlertController
              ) {
    this.getUserInfo();
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
            this.storage.remove('user');
            this.storage.remove('session');
            this.storage.remove('access_token');
            this.router.navigateByUrl('/')
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
        value: 1234
      },
      cssClass: 'language-chooser-modal'
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
        value: 1234
      },
      cssClass: 'language-chooser-modal'
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
        value: 1234
      },
      cssClass: 'language-chooser-modal'
    });
    return await modal.present();
  }
}
