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
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getFutureBookings();
  }
  hideCard() {
    this.hide = true;
  }

  getFutureBookings() {
        this.apiService.getUser().pipe(first()).subscribe(
            user => {
              console.log(user);
              this.futureBookings = [];
              // @ts-ignore
              this.bookings = user.bookings;
              // go through all bookings
              for (let booking of this.bookings) {
                // compare the dates if booking date is bigger (today or future)
                let date =  new Date(booking.Date.substring(0,10));
                let dateToday = new Date();
                date.setHours(0,0,0,0);
                dateToday.setHours(0,0,0,0);
                if (date > dateToday) {
                  this.futureBookings.push(booking);
                  booking.Date = booking.Date.substring(0, 10);
                  booking.duration = this.timeService.getTimeRange(booking.FirstTimeFrame, booking.LastTimeFrame);
                  booking.FirstTimeFrame = this.timeService.getStartTime(booking.FirstTimeFrame);
                } else if (date.getDate() == dateToday.getDate()) {
                  let hourNow = this.today.getHours();
                  let endTime = this.timeService.getEndTime(booking.LastTimeFrame).split(':');
                  // compare the hours, if bigger then add to future booking
                  if (endTime[0] > hourNow) {
                    this.futureBookings.push(booking);
                    booking.Date = booking.Date.substring(0,10);
                    booking.duration = this.timeService.getTimeRange(booking.FirstTimeFrame, booking.LastTimeFrame);
                    booking.FirstTimeFrame = this.timeService.getStartTime(booking.FirstTimeFrame);

                    // if same hour, compare minutes
                  } else if (endTime[0] == hourNow) {
                    if (endTime[1] >= this.today.getMinutes()) {
                      this.futureBookings.push(booking);
                      booking.Date = booking.Date.substring(0,10);
                      booking.duration = this.timeService.getTimeRange(booking.FirstTimeFrame, booking.LastTimeFrame);
                      booking.FirstTimeFrame = this.timeService.getStartTime(booking.FirstTimeFrame);

                    }
                  }
                }
              }
              // @ts-ignore
              this.futureBookings.sort((a, b) => new Date(a.Date) - new Date(b.Date))
            }, err => console.log(err))

  }


  doRefresh($event) {
    this.getFutureBookings();
    setTimeout(() => {
      $event.target.complete();
    }, 1000);
  }

}
