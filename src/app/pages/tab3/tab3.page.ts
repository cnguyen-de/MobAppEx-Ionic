import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PasswordChangerModalPage } from '../../modals/password-changer-modal/password-changer-modal.page';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(public modalController: ModalController) {}


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

}
