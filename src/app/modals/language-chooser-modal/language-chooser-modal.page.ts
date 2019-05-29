import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {ApiService} from '../../_services/api.service';

@Component({
  selector: 'app-language-chooser-modal',
  templateUrl: './language-chooser-modal.page.html',
  styleUrls: ['./language-chooser-modal.page.scss'],
})
export class LanguageChooserModalPage implements OnInit {


  constructor(public toastController: ToastController, private http : HttpClient,
              public storage : Storage, private apiService: ApiService,
              private modalController: ModalController) {
  }

  ngOnInit() {
  }


  chooseEnglish() {
    this.toast('Welcome!');
    this.dismiss();
  }

  chooseGerman() {
    this.toast('Willkommen!');
    this.dismiss()
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async toast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: "dark",
      keyboardClose: true
    });
    toast.present();
  }

}
