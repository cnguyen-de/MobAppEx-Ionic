import { Component, OnInit } from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {ApiService} from '../../_services/api.service';

@Component({
  selector: 'app-light-modal',
  templateUrl: './light-modal.page.html',
  styleUrls: ['./light-modal.page.scss'],
})
export class LightModalPage implements OnInit {

  constructor(public toastController: ToastController, private http : HttpClient,
              public storage : Storage, private apiService: ApiService,
              private modalController: ModalController) {
  }

  ngOnInit() {
  }


  onSubmit() {

  }


  dismiss() {
    this.modalController.dismiss();
  }

  async toast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: "dark"
    });
    toast.present();
  }

}
