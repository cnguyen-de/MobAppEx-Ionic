import { Component } from '@angular/core';
import { ApiService } from '../../_services/api/api.service';
import {Storage} from '@ionic/storage';
import {TimeService} from '../../_services/time/time.service';
import {first} from 'rxjs/operators';
import {booking} from '../../_services/booking';
import isEqual from 'lodash.isequal'
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {animate, state, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  animations: [
    trigger('changeDivSize', [
      state('initial', style({
        //backgroundColor: 'green',
        width: 'calc(100vw - 24px)',
        height: '210px'
      })),
      state('final', style({
        //backgroundColor: 'red',
        width: 'calc(100vw - 24px)',
        height: 'calc(95vh - 148px)'
      })),
      transition('initial=>final', animate('300ms')),
      transition('final=>initial', animate('300ms'))
    ])
  ]
})
export class Tab1Page {
  MINUTES_BEFORE_START = 10;
  hide: boolean = false;
  bookings: booking[] = [];
  today = new Date();
  futureBookings: booking[] = [];
  isFirstTime: boolean = true;
  loading: boolean = true;
  countDownTime: number;
  farFuture: boolean = false;
  viewActive:boolean = false;
  currentState = 'initial';

  constructor(private apiService: ApiService, private storage: Storage,
              private timeService: TimeService, private localNotifications: LocalNotifications){
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (this.futureBookings.length == 0) {
      this.loading = true;
    }
    this.storage.get('notificationPref').then(notificationPref => {
      if (typeof notificationPref == 'number') {
        this.MINUTES_BEFORE_START = notificationPref;
      }
    })
    this.storage.get('isFirstTime').then(data => {
      if (typeof data == 'boolean') {
        this.isFirstTime = data;
      } else {
        this.isFirstTime = true;
      }
      this.getFutureBookings();
      if (this.futureBookings.length == 0) {
        setTimeout(() => this.loading = false, 100);
      }
    });
  }

  hideCard() {
    this.hide = true;
  }

  getFutureBookings() {
    this.apiService.getUser().pipe(first()).subscribe(
        user => {
          this.storage.get('user').then(savedUser => {
            if (isEqual(user, savedUser) && !this.isFirstTime) {
              this.bookings = JSON.parse(JSON.stringify(savedUser.bookings));
              let sortedBooking = this.getFutureBookingsFromBookings(this.bookings);
              if (isEqual(sortedBooking, this.futureBookings)) {
                console.log("from cache")
              } else {
                console.log("from database");
                this.futureBookings = sortedBooking;
                setTimeout(() => this.loading = false, 100);
              }
            } else {
              this.loading = true;
              console.log('Processing new JSON');
              this.isFirstTime = false;
              this.storage.set('isFirstTime', false);
              // @ts-ignore
              this.bookings = JSON.parse(JSON.stringify(user.bookings));
              this.futureBookings = this.getFutureBookingsFromBookings(this.bookings);
              this.saveToStorage('futureBookings', this.futureBookings);
              setTimeout(() => this.loading = false, 100);
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

  getFutureBookingsFromBookings(bookings) {
    // go through all bookings
    let sortedBookings = [];
    //clone bookings
    for (let booking of bookings) {
      // compare the dates if booking date is bigger (today or future)
      let date = new Date(booking.Date.substring(0, 10));
      let dateToday = new Date();
      date.setHours(0, 0, 0, 0);
      dateToday.setHours(0, 0, 0, 0);
      // @ts-ignore
      booking.duration = this.timeService.getTimeRange(booking.FirstTimeFrame, booking.LastTimeFrame);
      booking.FirstTimeFrame = this.timeService.getStartTime(booking.FirstTimeFrame);
      booking.LastTimeFrame = this.timeService.getEndTime(booking.LastTimeFrame);
      booking.Date = booking.Date.substring(0, 10);
      booking.combinedIds = [booking.id];
      if (date > dateToday) {
        sortedBookings.push(booking);
      } else if (date.getDate() == dateToday.getDate()) {
        let hourNow = this.today.getHours();
        let endTime = booking.LastTimeFrame.split(':');
        // compare the hours, if bigger then add to future booking
        if (endTime[0] > hourNow) {
          sortedBookings.push(booking);
          // if same hour, compare minutes
        } else if (endTime[0] == hourNow) {
          if (endTime[1] >= this.today.getMinutes()) {
            sortedBookings.push(booking);
          }
        }
      }
    }
    // @ts-ignore
    sortedBookings.sort( function(a, b) {
          let aDate = a.Date.split('-');
          let aTime = a.FirstTimeFrame.split(':');
          let aDateTime = new Date(aDate[0], aDate[1] - 1, aDate[2], aTime[0], aTime[1]);
          let bDate = b.Date.split('-');
          let bTime = b.FirstTimeFrame.split(':');
          let bDateTime = new Date(bDate[0], bDate[1] - 1, bDate[2], bTime[0], bTime[1]);
          // @ts-ignore
          return aDateTime - bDateTime;
        }
    );
    //let combinedBookings = sortedBookings;
    //console.log(combinedBookings);
    //console.log(sortedBookings.length);
    //Combine consecutive bookings into one session
    let combined = false;
    let i = 0;
    while (!combined) {
      //console.log(i);
      if (sortedBookings.length > 1) {
        if (sortedBookings[i].LastTimeFrame == sortedBookings[i + 1].FirstTimeFrame &&
            sortedBookings[i].Capsule_id == sortedBookings[i + 1].Capsule_id) {
          //console.log("combined " + sortedBookings[i].LastTimeFrame, sortedBookings[i + 1].LastTimeFrame);

          sortedBookings[i].combinedIds.push(sortedBookings[i + 1].id);
          sortedBookings[i].LastTimeFrame = sortedBookings[i + 1].LastTimeFrame;
          sortedBookings[i].duration = sortedBookings[i].FirstTimeFrame + " - " + sortedBookings[i].LastTimeFrame;
          sortedBookings.splice(i + 1, 1);
          //console.log("sliced " + (i + 1));
          i = 0;
          continue;
        }

      } else {
        combined = true;
        break;
      }
      if (i == sortedBookings.length - 2) {
        console.log("combined");
        combined = true;
        break;
      }
      i++;
    }

    // Get Notification Preference
    this.storage.get('notificationPref').then(pref => {
      if (typeof pref == 'number') {
        if (pref > 0) {
          this.localNotifications.requestPermission().then(accept => {
            if (accept) {
              //Check if booking exists
              if (sortedBookings.length > 0) {
                //Get list of ids (1-6 possible ids)
                this.storage.get('pushNotificationID').then(notificationID => {
                  if (notificationID != null) {
                    let sameId = false;
                    // Compare each ids
                    for (let id of notificationID) {
                      if (sortedBookings[0].id == id) {
                        sameId = true;
                      }
                    }
                    //If no matching id = new booking -> new notification
                    if (!sameId) this.createNotificationFor(sortedBookings[0]);
                  } else { //If no id, and booking exists -> create new notification for this new booking
                    this.createNotificationFor(sortedBookings[0]);
                  }
                })
              }
            }
          })
        } else {
          this.storage.get('pushNotificationID').then(notificationID => {
            if (notificationID != null) {
              console.log("deleted notification id: " + notificationID);
              this.localNotifications.clear(notificationID);
            }
          })
        }
      }
    })

    //Create countdown timer for most recent booking
    if (sortedBookings.length > 0) {
      let dateArray = sortedBookings[0].Date.split('-');
      let timeArray = sortedBookings[0].FirstTimeFrame.split(':');
      let date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], timeArray[0], timeArray[1]);
      this.countDownTime = date.getTime() / 1000;
      let nowTimeStamp = this.today.getTime() / 1000;
      this.farFuture = this.countDownTime - nowTimeStamp > 86400;
    }

    return sortedBookings
  }

  createNotificationFor(closestBooking) {
    let dateArray = closestBooking.Date.split('-');
    let timeArray = closestBooking.FirstTimeFrame.split(':');
    let notifyingMin = timeArray[1] - this.MINUTES_BEFORE_START;

    console.log("created notification " + this.MINUTES_BEFORE_START + " min before, ID: " + closestBooking.combinedIds);
    //Check if the time start is less than 10 minutes then set notification to now.
    if (new Date(closestBooking.Date).getDate() == this.today.getDate()) {
      if (timeArray[0] - this.today.getHours() == 0) {
        if (timeArray[1] - this.today.getMinutes() <= this.MINUTES_BEFORE_START) {
          notifyingMin = this.today.getMinutes();
        }
      }
    }
    let date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], timeArray[0], notifyingMin);
    this.localNotifications.schedule({
      id: closestBooking.combinedIds,
      title: 'Snooze Capsule',
      icon: 'https://mobappex.web.app/assets/icon/favicon.png',
      text: 'Your Capsule is ready at ' + closestBooking.FirstTimeFrame,
      trigger: {
        at: date
      }
    });
    this.saveToStorage('pushNotificationID', closestBooking.id);
  }

  viewActiveCapsule() {
    this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
    setTimeout(() => this.viewActive = !this.viewActive,300)
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
