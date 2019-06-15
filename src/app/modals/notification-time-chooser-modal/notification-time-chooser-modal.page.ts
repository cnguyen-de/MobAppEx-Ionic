import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {ApiService} from '../../_services/api/api.service';
import {ModalController, NavParams} from '@ionic/angular';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-notification-time-chooser-modal',
  templateUrl: './notification-time-chooser-modal.page.html',
  styleUrls: ['./notification-time-chooser-modal.page.scss'],
})
export class NotificationTimeChooserModalPage implements OnInit {

  sliderValue: number;
  @Input() value: number;
  buttonPressed: boolean = false;

  constructor(private http : HttpClient,
              public storage : Storage, private apiService: ApiService,
              private navParams: NavParams, private modalController: ModalController) {
    this.value = this.navParams.get('value');
  }

  ngOnInit() {
    this.sliderValue = this.value;
  }

  onChange() {
    this.value = this.sliderValue;
  }

  confirm() {
    this.buttonPressed = !this.buttonPressed;
    this.dismiss(this.value);
  }

  dismiss(value) {
    this.modalController.dismiss(value);
  }
}
