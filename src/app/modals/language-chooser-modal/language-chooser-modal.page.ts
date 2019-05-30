import {Component, Input, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {ApiService} from '../../_services/api/api.service';


@Component({
  selector: 'app-language-chooser-modal',
  templateUrl: './language-chooser-modal.page.html',
  styleUrls: ['./language-chooser-modal.page.scss'],
})
export class LanguageChooserModalPage implements OnInit {

  @Input() value: string;

  constructor(private http : HttpClient,
              public storage : Storage, private apiService: ApiService,
              private navParams: NavParams, private modalController: ModalController) {
    this.value = this.navParams.get('value');
  }

  ngOnInit() {
  }


  chooseEnglish() {
    this.value = 'en';
    this.dismiss();
  }

  chooseGerman() {
    this.value = 'de';
    this.dismiss()
  }

  dismiss() {
    this.modalController.dismiss(this.value);
  }

}
