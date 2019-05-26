import { Component } from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(public modalController: ModalController) {}


  changePasswordModal() {
    //this.presentModal();
  }
  /*
  async presentModal() {
    const modal = await this.modalController.create({
      component: Tab3Page,
      componentProps: { value: 123 }
    });
    return await modal.present();
  }
  */
}
