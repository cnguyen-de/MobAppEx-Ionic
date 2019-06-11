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
import {User} from '../../_services/auth/user';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';
import {NotificationTimeChooserModalPage} from '../../modals/notification-time-chooser-modal/notification-time-chooser-modal.page';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  user: User;
  username: string;
  email: string;
  darkMode: boolean;
  lightPref: number = 0;
  volumePref: number = 0;
  notificationTime: number = 0;

  constructor(public modalController: ModalController, private storage: Storage,
              private router: Router, private themeService: ThemeService,
              private alertController: AlertController, private toastController: ToastController,
              private apiService: ApiService, private nativePageTransitions: NativePageTransitions,
              private translateService: TranslateService) {

  }

  ionViewWillEnter() {
    this.getUserInfo();
    this.getDarkValue();
    this.storage.get('notificationPref').then(pref => {
      if (typeof pref == 'number') {
        this.notificationTime = pref;
      }
    })
  }

  // User Info
  getUserInfo() {
    this.storage.get('user').then(user => {
      if (user != null || typeof user != 'undefined') {
        console.log("Setting user data from memory");
        this.user = user;
        this.username = user.username;
        this.email = user.email;
        if (user.capsulePreference != null) {
          this.lightPref = user.capsulePreference.LightLevel;
          this.volumePref = user.capsulePreference.VolumenLevel;
        }
      } else {
        console.log("Retrieving user data from server");
        this.apiService.getUser()
            .pipe(first())
            .subscribe(
                user => {
                  this.user = user;
                  this.username = user.username;
                  this.email = user.email;
                  if (user.capsulePreference != null) {
                    this.lightPref = user.capsulePreference.LightLevel;
                    this.volumePref = user.capsulePreference.VolumenLevel;
                  }
                },
                error => {
                  console.log(error);
                });
      }
    })
  }

  //Navigate to booking history
  bookingHistory(){
    this.transitionTo('/booking-history', 'left');
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
      mode: 'md',
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
                      this.transitionTo('/', 'right');
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

  //Change notification timer
  notificationTimer() {
    this.presentNotificationTimerModal();
  }
  async presentNotificationTimerModal() {
    const modal = await this.modalController.create({
      component: NotificationTimeChooserModalPage,
      componentProps: {
        value: this.notificationTime
      },
      cssClass: 'chooser-modal'
    });

    modal.onDidDismiss().then(value => {
      if (typeof value.data != 'undefined') {
        this.notificationTime = value.data;
        this.saveToStorage('notificationPref', this.notificationTime).then(() => {
          this.toast("Notification preference saved");
        });
      }
    });

    return await modal.present();
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
      if (typeof value.data != 'undefined') {
        this.volumePref = value.data.VolumenLevel;
        this.user.capsulePreference = value.data;
        this.saveToStorage('user', this.user).then(() => {
          this.toast("Volume preference set to: " + this.volumePref)
        });
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
      if (typeof value.data != 'undefined') {
        this.lightPref = value.data.LightLevel;
        this.user.capsulePreference = value.data;
        this.saveToStorage('user', this.user).then(() => {
          this.toast("Light preference set to: " + this.lightPref)
        })
      }
    });

    return await modal.present();
  }

  showContact() {
    this.toast("Ask Snooze Team 😊")
  }

  transitionTo(path, direction) {
    let options: NativeTransitionOptions = {
      direction: direction,
      duration: 200,
      slowdownfactor: 1,
      androiddelay: 200,
    };
    this.nativePageTransitions.slide(options);
    this.router.navigateByUrl(path);
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
