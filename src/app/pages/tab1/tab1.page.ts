import { Component } from '@angular/core';
import { ApiService } from '../../_services/api/api.service';
import {Storage} from '@ionic/storage';
import {TimeService} from '../../_services/time/time.service';
import {first} from 'rxjs/operators';
import {booking} from '../../_services/booking';

import isEqual from 'lodash.isequal'


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
  isFirstTime: boolean = true;

  constructor(private apiService: ApiService, private storage: Storage,
              private timeService: TimeService){
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.storage.get('isFirstTime').then(data => {
      if (typeof data == 'boolean') {
        this.isFirstTime = data;
      } else {
        this.isFirstTime = true;
      }
      this.getFutureBookings();
    })
  }

  hideCard() {
    this.hide = true;
  }

  getFutureBookings() {
    this.apiService.getUser().pipe(first()).subscribe(
        user => {
          this.storage.get('user').then(savedUser => {
            if (isEqual(user, savedUser) && !this.isFirstTime) {
              if (isEqual(this.bookings, savedUser.bookings)) {
                console.log('Showing cache data');
              } else {
                this.bookings = savedUser.bookings;
                console.log('Getting data from database')
              }
              this.getFutureBookingsFromBookings()
            } else {
              console.log('Processing new JSON');
              this.isFirstTime = false;
              this.storage.set('isFirstTime', false);
              // @ts-ignore
              this.bookings = JSON.parse(JSON.stringify(user.bookings));
              this.getFutureBookingsFromBookings()
            }
          });
        }, err => {
          console.log(err);
          this.storage.get('futureBookings').then(bookings => {
            if (typeof bookings != 'undefined') {
              if (!isEqual(this.futureBookings, bookings)) {
                console.log('err');
              }
              this.futureBookings = bookings;
              console.log('err')
            }
          })
        });
  }

  getFutureBookingsFromBookings() {
    // go through all bookings
    this.futureBookings = [];
    //clone bookings
    for (let booking of this.bookings) {
      // compare the dates if booking date is bigger (today or future)
      let date = new Date(booking.Date.substring(0, 10));
      let dateToday = new Date();
      date.setHours(0, 0, 0, 0);
      dateToday.setHours(0, 0, 0, 0);
      // @ts-ignore
      booking.duration = this.timeService.getTimeRange(booking.FirstTimeFrame, booking.LastTimeFrame);
      booking.FirstTimeFrame = this.timeService.getStartTime(booking.FirstTimeFrame);
      booking.Date = booking.Date.substring(0, 10);
      if (date > dateToday) {
        this.futureBookings.push(booking);
      } else if (date.getDate() == dateToday.getDate()) {
        let hourNow = this.today.getHours();
        console.log(this.timeService.getEndTime(booking.LastTimeFrame));
        let endTime = this.timeService.getEndTime(booking.LastTimeFrame).split(':');
        // compare the hours, if bigger then add to future booking
        if (endTime[0] > hourNow) {
          this.futureBookings.push(booking);
          // if same hour, compare minutes
        } else if (endTime[0] == hourNow) {
          if (endTime[1] >= this.today.getMinutes()) {
            this.futureBookings.push(booking);
          }
        }
      }
    }
    // @ts-ignore
    this.futureBookings.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    this.saveToStorage('futureBookings', this.futureBookings);
  }
  doRefresh($event) {
    this.getFutureBookings();
    setTimeout(() => {
      $event.target.complete();
    }, 700);
  }

  async saveToStorage(key, val) {
    await this.storage.set(key, val);
  }
}
