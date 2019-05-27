import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PasswordChangerModalPage } from '../../modals/password-changer-modal/password-changer-modal.page';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import {ThemeService} from '../../_services/theme/theme.service';

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
              private router: Router, private themeService: ThemeService) {
    this.getUserInfo();
  }

  switchTheme() {
    this.darkMode = !this.darkMode;
    this.themeService.enableDarkMode(this.darkMode)
  }

  logOut() {
    this.storage.remove('user');
    this.storage.remove('session');
    this.storage.remove('access_token');
    this.router.navigateByUrl('/')

  }

  changePasswordModal() {
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: PasswordChangerModalPage,
      componentProps: {
        value: 123
      },
      cssClass: 'password-changer-modal'
    });
    return await modal.present();
  }

  getUserInfo() {
    this.storage.get('user').then(user => {
      this.username = user.username;
      this.email = user.email;
    })
  }

}
