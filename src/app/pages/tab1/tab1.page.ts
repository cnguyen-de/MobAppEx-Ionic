import { Component } from '@angular/core';
import { ApiService } from '../../_services/api/api.service';
import {Storage} from '@ionic/storage';
import {TimeService} from '../../_services/time/time.service';
import {first} from 'rxjs/operators';
import {booking} from '../../_services/booking';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  hide: boolean = false;
  bookings: booking[] = [];
  today = new Date();
  futureBookings: booking[] = [];

  constructor(private apiService: ApiService, private storage: Storage,
              private timeService: TimeService){
    this.getFutureBookings();
  }

  ngOnInit() {}

  hideCard() {
    this.hide = true;
  }

  getFutureBookings() {
    this.apiService.getToken().then(token => {
      if (token != null) {
        this.apiService.getUser(token).pipe(first()).subscribe(
            user => {
              this.futureBookings = [];
              // @ts-ignore
              this.bookings = user.bookings;
              // go through all bookings
              for (let booking of this.bookings) {
                // compare the dates if booking date is bigger (today or future)
                console.log();
                let date =  new Date(booking.Date.substring(0,10));
                let dateToday = this.today;
                date.setHours(0,0,0,0);
                dateToday.setHours(0,0,0,0);
                if (date >= dateToday) {
                  let hourNow = this.today.getHours();
                  let startTime = this.timeService.getStartTime(booking.FirstTimeFrame).split(':')[0];
                  // compare the hours, if bigger then add to future booking
                  if (startTime >= hourNow) {
                    this.futureBookings.push(booking);
                    booking.Date = booking.Date.substring(0,10);
                    booking.duration = this.timeService.getTimeRange(booking.FirstTimeFrame, booking.LastTimeFrame);
                  }
                }
              }
            }, err => console.log(err))
      }
    });
  }

  doRefresh($event) {
    this.getFutureBookings();
    setTimeout(() => {
      $event.target.complete();
    }, 1000);
  }

}
