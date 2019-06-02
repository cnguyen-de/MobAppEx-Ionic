import { Component } from '@angular/core';
import { ApiService } from '../../_services/api/api.service';
import {Storage} from '@ionic/storage';
import {TimeService} from '../../_services/time/time.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  hide: boolean = false;
  bookings: [];
  today = new Date();
  futureBookings = [];

  constructor(private apiService: ApiService, private storage: Storage,
              private timeService: TimeService){
    this.getFutureBookings();
  }

  ngOnInit(){

  }

  hideCard() {
    this.hide = true;
  }

  getFutureBookings() {
    this.storage.get('user').then(user => {
      this.bookings = user.bookings;
      // go through all bookings
      for (let booking of this.bookings) {
        // compare the dates if booking date is bigger (today or future)
        if (new Date(booking.Date) >= this.today) {
          //console.log(booking.Date);
          let hourNow = this.today.getHours();
          let startTime = this.timeService.getStartTime(booking.FirstTimeFrame).split(':')[0];
          // compare the hours, if bigger then add to future booking
          if (startTime >= hourNow) {
            this.futureBookings.push(booking);
          }
        }
      }
      this.changeTimes();
    })
  }

  changeTimes() {
    for (let booking of this.futureBookings) {
      booking.duration = this.timeService.getTimeRange(booking.FirstTimeFrame, booking.LastTimeFrame);
    }
  }

}
