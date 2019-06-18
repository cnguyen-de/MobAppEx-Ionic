import {Component} from '@angular/core';
import {ApiService} from '../../_services/api/api.service';
import {Storage} from '@ionic/storage';
import {TimeService} from '../../_services/time/time.service';
import {first} from 'rxjs/operators';
import {booking} from '../../_services/booking';
import isEqual from 'lodash.isequal';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {User} from '../../_services/auth/user';
import {CheckoutModalPage} from '../../modals/checkout-modal/checkout-modal.page';
import {IonSlides, IonSegment, IonContent, Platform, ModalController, ToastController, AlertController} from '@ionic/angular';
import {BookingHistoryPage} from '../booking-history/booking-history.page';
import {LightModalPage} from '../../modals/light-modal/light-modal.page';
import {ExtendCapsuleModalPage} from '../../modals/extend-capsule-modal/extend-capsule-modal.page';


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
        width: 'calc(100vw)',
        height: 'calc(100vh - 57px)'
      })),
      transition('initial=>final', animate('300ms ease-in')),
      transition('final=>initial', animate('200ms ease-in'))
    ])
  ]
})
export class Tab1Page {
  MINUTES_BEFORE_START = 10;
  bookings: booking[] = [];
  today = new Date();
  futureBookings: booking[] = [];
  isFirstTime: boolean = true;
  loading: boolean = true;
  countDownTime: number;
  farFuture: boolean = false;
  viewActive: boolean = false;
  currentState = 'initial';
  user: any;
  username: string;
  email: string;
  volumeSlider: number = 0;
  lightSlider: number = 0;
  isNextSlotAvailable: boolean = false;
  selectedCount: number;
  PRICE_PER_SLOT: number = 2;
  extendSlots: number = 1;
  freeSlots: string[] = [];
  days = [];
  segmentWidth: number = 100;
  todayBookings: any = [];
  todayActiveBookings: any = [];
  endCountDownTime: number;
  paymentID: string;
  chosenSlot = {
    count: 0,
    slot: ''
  };
  language: string;

  constructor(private apiService: ApiService,
              private storage: Storage,
              private nativePageTransitions: NativePageTransitions,
              private modalController: ModalController,
              private router: Router,
              private timeService: TimeService,
              private toastController: ToastController,
              private localNotifications: LocalNotifications,
              private alertController: AlertController,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    //this.getUserInfo();
  }

  ionViewWillEnter() {
    this.storage.get('language').then(lang => {
      if (lang != null) {
        this.language = lang;
      }
    })
    this.getUserInfo();
    if (this.futureBookings.length == 0) {
      this.loading = true;
    }
    this.storage.get('notificationPref').then(notificationPref => {
      if (typeof notificationPref == 'number') {
        this.MINUTES_BEFORE_START = notificationPref;
      }
    });
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

  //Navigate to capsule control
  capsuleControl() {
    this.transitionTo('/capsule-control', 'left');
  }

  transitionTo(path, direction) {
    let options: NativeTransitionOptions = {
      direction: direction,
      duration: 200,
      slowdownfactor: 1,
      androiddelay: 200,
    };
    this.nativePageTransitions.slide(options);
    this.router.navigateByUrl(path);
  }

  getFutureBookings() {
    this.apiService.getUser().pipe(first()).subscribe(
        user => {
          this.storage.get('user').then(savedUser => {
            if (isEqual(user, savedUser) && !this.isFirstTime) {
              this.bookings = JSON.parse(JSON.stringify(savedUser.bookings));
              let sortedBooking = this.getFutureBookingsFromBookings(this.bookings);
              if (isEqual(sortedBooking, this.futureBookings)) {
                console.log('from cache');
              } else {
                console.log('from database');
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
              console.log('err');
            }
          });
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
    sortedBookings.sort(function (a, b) {
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
          sortedBookings[i].duration = sortedBookings[i].FirstTimeFrame + ' - ' + sortedBookings[i].LastTimeFrame;
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
        console.log('combined');
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
                    if (!sameId) {
                      this.createNotificationFor(sortedBookings[0]);
                    }
                  } else { //If no id, and booking exists -> create new notification for this new booking
                    this.createNotificationFor(sortedBookings[0]);
                  }
                });
              }
            }
          });
        } else {
          this.storage.get('pushNotificationID').then(notificationID => {
            if (notificationID != null) {
              console.log('deleted notification id: ' + notificationID);
              this.localNotifications.clear(notificationID);
            }
          });
        }
      }
    });

    //Create countdown timer for most recent booking
    if (sortedBookings.length > 0) {
      let dateArray = sortedBookings[0].Date.split('-');
      let timeArray = sortedBookings[0].FirstTimeFrame.split(':');
      let date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], timeArray[0], timeArray[1]);
      this.countDownTime = date.getTime() / 1000;
      //console.log(date, this.countDownTime);
      let nowTimeStamp = this.today.getTime() / 1000;
      this.farFuture = this.countDownTime - nowTimeStamp > 86400;

      let endTimeArray = sortedBookings[0].LastTimeFrame.split(':');
      let endDateTime = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], endTimeArray[0], endTimeArray[1]);
      this.endCountDownTime = endDateTime.getTime() / 1000;
      //console.log(endDateTime, this.endCountDownTime);

    }

    return sortedBookings;
  }

  createNotificationFor(closestBooking) {
    let dateArray = closestBooking.Date.split('-');
    let timeArray = closestBooking.FirstTimeFrame.split(':');
    let notifyingMin = timeArray[1] - this.MINUTES_BEFORE_START;

    console.log('created notification ' + this.MINUTES_BEFORE_START + ' min before, ID: ' + closestBooking.combinedIds);
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
    //console.log(date, this.countDownTime);
    let nowTimeStamp = this.today.getTime() / 1000;
    let isActive = nowTimeStamp - this.countDownTime >= 0;
    console.log(isActive);

    if (this.currentState === 'initial') {
      if (!isActive) {
        // comment this for live capsule control
        this.presentAlertConfirm();
        //this.toast(this.translateService.instant('CAPSULE_NOT_YET_ACTIVE'));
        return;
      }
    }

    this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
    setTimeout(() => this.viewActive = !this.viewActive, 100);
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      mode: 'md',
      cssClass: 'alert-dialog',
      header: this.translateService.instant('CAPSULE_NOT_ACTIVE_HEADER'),
      message: this.translateService.instant('CAPSULE_NOT_ACTIVE_TEXT'),
      buttons: [
        {
          text: this.translateService.instant('CANCEL'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: this.translateService.instant('CONFIRM'),
          handler: () => {
            this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
            setTimeout(() => this.viewActive = !this.viewActive, 100);
          }
        }
      ]
    });
    await alert.present();
  }

  doRefresh($event) {
    this.getFutureBookings();
    setTimeout(() => {
      $event.target.complete();
    }, 700);
  }

  sliderChange() {
    this.apiService.setVolumeAndLightPreference(this.volumeSlider, this.lightSlider)
        .pipe(first())
        .subscribe(
            data => {
              this.user.capsulePreference = data;
              this.saveToStorage('user', this.user).then(() => {
              });
            },
            error => {
              console.log(error);
            });
  }

  pickSlots() {
    this.apiService.getCapsuleAvailability(this.futureBookings[0].capsule.id, this.futureBookings[0].Date).subscribe(data => {
      if (data[this.timeService.getIntSlot(this.futureBookings[0].LastTimeFrame + '')]) {

        var lastFrame = Number(this.timeService.getIntSlot(this.futureBookings[0].LastTimeFrame + ''));
        var i = 0;
        this.freeSlots = [];
        while (data[lastFrame] && i < 6 && this.maxTimeBooked(this.user.bookings) <= 15) {

          this.freeSlots.push(this.timeService.getEndTime(lastFrame));

          lastFrame++;
          i++;
        }
        console.log(this.freeSlots);
        this.presentExtendCapsuleModal();
      } else {
        this.toast(this.translateService.instant('CAPSULE_EXTEND_TAKEN'));
      }
    });
  }

  async presentExtendCapsuleModal() {
    const modal = await this.modalController.create({
      component: ExtendCapsuleModalPage,
      componentProps: {
        value: this.freeSlots
      },
      cssClass: 'extend-capsule-modal'
    });

    modal.onDidDismiss().then(value => {
      if (typeof value.data != 'undefined') {
        console.log(value.data);
        this.chosenSlot = value.data;
        this.presentCheckOutModal();
      }
    });

    return await modal.present();
  }

  maxTimeBooked(bookings: booking[]) {
    this.todayBookings = [];
    this.todayActiveBookings = [];
    for (var i = 0; i < bookings.length; i++) {
      if (bookings[i].Date.slice(0, 10) == this.today.toISOString().slice(0, 10)) {
        this.todayBookings.push(bookings[i]);
      }
    }
    for (var i = 0; i < this.todayBookings.length; i++) {
      if (this.todayBookings[i].Capsule_id == this.todayBookings[0].Capsule_id) {
        this.todayActiveBookings.push(this.todayBookings[i]);
      }
    }
    var sumSlots = 0;
    for (var i = 0; i < this.todayActiveBookings.length; i++) {
      console.log(this.todayActiveBookings[i].LastTimeFrame - this.todayActiveBookings[i].FirstTimeFrame);
      sumSlots += (this.todayActiveBookings[i].LastTimeFrame - this.todayActiveBookings[i].FirstTimeFrame + 1);
    }
    return sumSlots;
  }

  // User Info
  getUserInfo() {
    this.storage.get('user').then(user => {
      if (user != null || typeof user != 'undefined') {
        console.log('Setting user data from memory');
        // console.log(user);
        this.user = user;
        this.username = user.username;
        this.email = user.email;
        if (user.capsulePreference != null) {
          this.lightSlider = user.capsulePreference.LightLevel;
          this.volumeSlider = user.capsulePreference.VolumenLevel;
        }
      } else {
        console.log('Retrieving user data from server');
        this.apiService.getUser()
            .pipe(first())
            .subscribe(
                user => {
                  // console.log(user);
                  this.user = user;
                  this.username = user.username;
                  this.email = user.email;
                  if (user.capsulePreference != null) {
                    this.lightSlider = user.capsulePreference.LightLevel;
                    this.volumeSlider = user.capsulePreference.VolumenLevel;
                  }
                },
                error => {
                  console.log(error);
                });
      }
    });
  }

  //Toast Handler
  async toast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      cssClass: 'toast-container',
      keyboardClose: true,
    });
    toast.present();
  }

  async saveToStorage(key, val) {
    await this.storage.set(key, val);
  }

  async presentCheckOutModal() {
    const modal = await this.modalController.create({
      component: CheckoutModalPage,
      componentProps: {
        paymentAmount: this.chosenSlot.count * this.PRICE_PER_SLOT,
        timeStart: this.futureBookings[0].LastTimeFrame,
        timeEnd: this.chosenSlot.slot,
        date: this.futureBookings[0].Date,
        capsule: this.futureBookings[0].capsule.Name
      },
      cssClass: 'paypal-modal'
    });

    modal.onDidDismiss().then(value => {
      if (typeof value.data == 'string') {
        this.paymentID = value.data;
        this.toast(this.translateService.instant('CAPSULE_PAYPAL_SEND'));
        let today = new Date();
        let dateTime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' +
            today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

        this.localNotifications.schedule({
          id: this.futureBookings[0].capsule.id,
          title: this.translateService.instant('NOTIFICATION_PAYPAL_SUCCESS'),
          icon: 'https://mobappex.web.app/assets/icon/favicon.png',
          text: 'At ' + dateTime + ' you booked Capsule ' + this.futureBookings[0].capsule.Name +
              ' for ' + this.chosenSlot.count * this.PRICE_PER_SLOT + '€'
        });

        this.apiService.bookCapsule(
            this.futureBookings[0].capsule.id, //Capsule Id
            this.futureBookings[0].Date, // Date
            this.timeService.getIntSlot(String(this.futureBookings[0].LastTimeFrame)), // First slot
            this.timeService.getIntSlot(this.chosenSlot.slot) - 1, // Last slot
            'PayPal', // Vendor
            this.chosenSlot.count * this.PRICE_PER_SLOT, // Amount
            true, // Verified
            this.paymentID // Paypal Payment id
        ).subscribe(data => {

          this.apiService.getUser()
                  .pipe(first())
                  .subscribe(
                    user => {
                      //console.log(user.bookings);
                      this.user = user;
                      this.saveToStorage('user', user);
                      this.getFutureBookings();
                      this.viewActiveCapsule();
                    },
                    error => {
                      console.log(error);
                    });
          console.log(data)
        })
      }
    });


    return await modal.present();
  }
}
