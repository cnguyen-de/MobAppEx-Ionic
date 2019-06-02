import { Component } from '@angular/core';
import { ApiService } from '../../_services/api/api.service';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  empty: boolean = true;
  hide: boolean = false;
  bookings: [];

  constructor(private apiService: ApiService, private storage: Storage){
  }

  ngOnInit(){

  }

  hideCard() {
    this.hide = true;
  }

  getBookings() {
    this.storage.get('user').then(user => {
      this.bookings = user.bookings;
    })
  }
}
