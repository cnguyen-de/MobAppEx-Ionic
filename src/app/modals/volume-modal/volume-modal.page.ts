import {Component, Input, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {ApiService} from '../../_services/api/api.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-volume-modal',
  templateUrl: './volume-modal.page.html',
  styleUrls: ['./volume-modal.page.scss'],
})
export class VolumeModalPage implements OnInit {

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
    this.apiService.setVolumePreference(this.value)
        .pipe(first())
        .subscribe(
            data => {
              this.dismiss();
              this.buttonPressed = !this.buttonPressed;
            },
            error => {
              this.buttonPressed = !this.buttonPressed;
              console.log(error);
            });
  }

  dismiss() {
    this.modalController.dismiss(this.value);
  }
}
