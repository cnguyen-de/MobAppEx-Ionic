import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {ApiService} from '../../_services/api/api.service';
import {ModalController, NavParams} from '@ionic/angular';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-extend-capsule-modal',
  templateUrl: './extend-capsule-modal.page.html',
  styleUrls: ['./extend-capsule-modal.page.scss'],
})
export class ExtendCapsuleModalPage implements OnInit {

  @Input() slots: number;
  chosen = {
    count: 0,
    slot: ""
  }

  constructor(private http : HttpClient,
              public storage : Storage, private apiService: ApiService,
              private navParams: NavParams, private modalController: ModalController) {
    this.slots = this.navParams.get('value');
    console.log(this.slots);
  }

  ngOnInit() {
  }

  extendSlot(index, slot) {
    this.chosen = {
      count: index + 1,
      slot: slot
    };
    console.log(this.chosen);
    this.dismiss(this.chosen)
  }

  dismiss(value) {
    this.modalController.dismiss(value);
  }

}
