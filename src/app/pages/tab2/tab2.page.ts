import { map } from 'rxjs/operators';
import { Component, ViewChild, OnInit } from "@angular/core";
import { IonSlides, IonSegment, IonContent, Platform, ModalController, ToastController, AlertController } from '@ionic/angular';
import { LocationService } from '../../_services/location.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ApiService } from '../../_services/api/api.service';
import { TimeService } from '../../_services/time/time.service';
import { AgmMap, AgmCoreModule } from '@agm/core';
import { LightModalPage } from '../../modals/light-modal/light-modal.page';
import { CheckoutModalPage } from '../../modals/checkout-modal/checkout-modal.page';
import { first } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

import { booking } from '../../_services/booking';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import isEqual from 'lodash.isequal';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
  animations: [
    trigger('animatecardtotop', [
      state('bottom', style({
        transform: 'translateY(0px)'
      })),
      state('top', style({
        //transform : 'translateY(-490px)',
        width: 'calc(100% - 20px)',
        height: '120px',
        position: 'absolute',
        top: 0,
        left: 0

      })),
      transition('bottom <=> top', animate('300ms ease-in'))
    ]),
    trigger('animatemapup', [
      state('bottom', style({
        transform: 'translateY(0px)'
      })),
      state('top', style({
        transform: 'translateY(-102%)',

      })),
      transition('bottom <=> top', animate('300ms ease-in'))
    ])
  ],


})
export class Tab2Page implements OnInit {
  @ViewChild("slider") slider: IonSlides;
  @ViewChild('segment') segment: IonSegment;
  @ViewChild('content') content: IonContent;
  @ViewChild('tscontent') tscontent: IonContent;
  @ViewChild('slides') slides: IonSlides;
  @ViewChild('picker') picker;


  constructor(private locationService: LocationService,
    private apiService: ApiService,
    private platform: Platform,
    public timeService: TimeService,
    private modalController: ModalController,
    private toastController: ToastController,
    private storage: Storage,
    private translateService: TranslateService,
    private localNotifications: LocalNotifications,
    private _adapter: DateAdapter<any>,
    private alertController: AlertController) { }

  //payment ID from paypal
  paymentID: string;
  // set to false to use GPS location!
  fixedLocation: boolean = true;

  //Map
  mapZoomLevel: number = 17;
  latMapCenter: number = 50.1303316;
  lngMapCenter: number = 8.69238764;
  personIcon: string = '../../../assets/images/icons/LocationPerson.svg';
  capsuleIcon: string = '../../../assets/images/icons/SnoozeMarker.svg';
  spinBtnPositionPressed = false;
  mapStyle = [];


  //Slider Configs
  slidesConfig = {
    spaceBetween: 10,
    centeredSlides: true,
    slidesPerView: 1.5
  };

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    loop: true,
  };

  //Animations
  cardTSS_state: string = "bottom";

  //Single Capsule Values
  capName = '';
  capId = '1';

  //Capsules
  capsules = [];

  //Day Segments
  excludeSundays = true;
  days = [];
  DAYSRANGE: number = 30;

  // Current Time
  currentTime;

  //Timeslots
  timeslots = [];
  segmentWidth: number = 100;
  allowOnlyOneBooking = false;
  MAX_SLOTS_PER_DAY = 15;
  MAX_SLOTS_PER_BOOKING = 6;
  PRICE_PER_SLOT = 3;
  bookedArray_Up = [];
  bookedArray_Down = [];
  bookedArray_AfterNext_Up = [];
  bookedArray_AfterNext_Down = [];
  bookedArray_Between = [];

  selectedCount = 0;
  firstSelected = -1;
  lastSelected = -1;

  bookingsQueue = [];

  userBookingsArray = [];
  userBookingsSlotsArray = [];

  futureBookings = [];

  activeDate = new Date();
  activeDate_String = '';


  //Calendar
  minDate = new Date();
  maxDate = new Date();
  datePickerFilter: any;


  /**
   * View Lifecycle: Triggered once when view is being inititialized
   */
  ngOnInit() {

    // Set current date
    let currentDate = new Date();
    //console.log(currentDate);

    //Set max date -> today + daysRange (30days)
    this.maxDate.setDate(currentDate.getDate() + this.DAYSRANGE - 1);


    this.activeDate_String = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();

    //Create 30 days for days-segment
    for (let i = 0; i < this.DAYSRANGE; i++) {
      var date = new Date();
      date.setDate(date.getDate() + i);

      let formattedDate = new Intl.DateTimeFormat(this.translateService.instant('LANGUAGE_CODE'), {
        // weekday: 'short',
        month: 'short',
        day: '2-digit'
      }).format(date);

      let formattedDay = new Intl.DateTimeFormat(this.translateService.instant('LANGUAGE_CODE'), {
        weekday: 'long'
      }).format(date);

      if (i == 0) {
        formattedDate = this.translateService.instant('TODAY');
        formattedDay = '';
      } else if (i == 1) {
        formattedDate = this.translateService.instant('TOMORROW');
        formattedDay = '';
      }

      // creating day object
      let day = {
        dateRAW: date,
        date: formattedDate,
        day: formattedDay,
        value: i.toString()
      }

      // adding days to days-array; excluding sundays if option set
      if (this.excludeSundays == true) {
        if (day.dateRAW.getDay() != 0) {
          this.days.push(day);
        }
      } else {
        this.days.push(day);
      }
    }

    // setting sundays as not selectable in 'Angular Material' calendar view 
    if (this.excludeSundays == true) {
      this.datePickerFilter = (d: Date): boolean => {
        const day = d.getDay();
        // Prevent Sundays from being selected.
        return day !== 0;
      }
    }

    // set first segment of days-segment as checked
    this.segment.value = '0';



    // Demo Data
    // this.capsules = [
    //   {
    //     lat: 50.13017685,
    //     lng: 8.69303674,
    //     isOpen: true,
    //     name: "Gebäude 1"
    //   },
    //   {
    //     lat: 50.13122569,
    //     lng: 8.69226426,
    //     isOpen: false,
    //     name: "Bibliothek"
    //   },
    //   {
    //     lat: 50.12887008,
    //     lng: 8.69176537,
    //     isOpen: false,
    //     name: "BCN"
    //   }
    // ];



    // get User.Bookings from server
    this.getUserBookings();


    // Hardware backbutton
    this.platform.backButton.subscribe(() => {
      if (this.picker.opened == true) {
        this.picker.close();
      }
      else if (this.cardTSS_state == 'top') {
        this.animateTSS_Click();
      }
    });

  }


  /**
   * View Lifecycle: Triggerd everytime view is being entererd. 
   * Used for loading or setting up data, which may have changed
   */
  ionViewDidEnter() {

    // loading dark map style if dark theme selected
    this.storage.get('dark').then(dark => {
      if (typeof dark == 'boolean') {
        if (dark) {
          this.mapStyle = this.mapDarkStyle;
        } else {
          this.mapStyle = [];
        }
      }
    });

    /**
     * getting capsules from server if apsules equal to chached 
     */ 
    this.apiService.getCapsules().subscribe(data => {
      this.storage.get('capsules').then(savedCaps => {
        //console.log('saved', savedCaps);
        if (isEqual(data, savedCaps)) {
          console.log('caps from cache');

          if (this.capsules.length == 0) {
            this.capsules = savedCaps;

            for (let cap in savedCaps) {
              //console.log(data[cap]);
              this.capsules[cap].calculatedDistance = this.locationService.getDistanceFromLatLonInKm(this.latMapCenter, this.lngMapCenter, savedCaps[cap].Latitude, savedCaps[cap].Longitude);

              //this.capsules.push(data[cap]);
            }
            this.capsules.sort(this.compare_Distance);
            this.getUserBookings();

            //Open marker-popup for first marker
            this.capsules[0].isOpen = true;
          }
        } else {
          //console.log('caps from server');
          this.storage.set('capsules', data).then(data => {
            this.capsules = [];
            for (let cap in data) {
              //console.log(data[cap]);
              data[cap].calculatedDistance = this.locationService.getDistanceFromLatLonInKm(this.latMapCenter, this.lngMapCenter, data[cap].Latitude, data[cap].Longitude);

              this.capsules.push(data[cap]);
            }
            this.capsules.sort(this.compare_Distance);
            this.getUserBookings();

            //Open marker-popup for first marker
            this.capsules[0].isOpen = true;
          });
        }
      });
    });

    /** 
     * Retrieve Current Position
     */
    if (!this.fixedLocation) {
      this.locationService.getCurrentPosition().then(data => {
        console.log('Result getting location in Component', data);
        this.latMapCenter = data.coords.latitude;
        this.lngMapCenter = data.coords.longitude;

        for (let cap in this.capsules) {
          this.capsules[cap].calculatedDistance = this.locationService.getDistanceFromLatLonInKm(this.latMapCenter, this.lngMapCenter, this.capsules[cap].Latitude, this.capsules[cap].Longitude);
        }
        this.capsules.sort(this.compare_Distance);
      });
    }



    // set date picker format depending on language
    this.setDatePickerFormat();
  }




  
  // * * * * * * * * * * * * *
  // C A P S U L E - C A R D S
  // * * * * * * * * * * * * *

  /**
   * Reacting to click by moving capsule card into view and show popup of active marker on the map
   * @param i index of the clicked card
   */
  capsuleCardClicked(i) {
    this.hideAllMarkerPopUs();
    this.slider.slideTo(i);
    this.capsules[i].isOpen = true;
  }

  /**
   * Reacting to sliding the capsule cards by showing the popup of the active marker on the map
   */
  onSlideChanged() {
    this.hideAllMarkerPopUs();
    this.slider.getActiveIndex().then(data => {
      this.capsules[data].isOpen = true;
    });
  }

  setBookedLabel() {
    if (this.capsules.length > 0 && this.futureBookings.length > 0) {

      // Find capsule id in future bookings and apply booked label to capsule
      for (let book in this.futureBookings) {
        var result = this.capsules.find(obj => {
          return obj.id == this.futureBookings[book].capsuleId;
        });

        this.capsules[this.capsules.indexOf(result)].isBooked = true;
      }
    }
  }

  /**
   * Calculating the distance between two lat/lng positions
   * @param lat1 Latitude of Postion 1
   * @param lng1 Longitude of Postion 1
   * @param lat2 Latitude of Postion 2
   * @param lng2 Longitude of Postion 2
   */
  getDistance(lat1, lng1, lat2, lng2) {
    return this.locationService.getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2);
  }

  /**
   * Executes the animation when clicked and prpares UI accordingly to the new state
   * @param item is the capsule
   */
  async animateTSS_Click(item?) {
    if (item) {
      this.capName = item.Name;
      this.capId = item.id;
      this.PRICE_PER_SLOT = parseFloat(item.Price);
    }

    let elemo = await document.getElementById("root");
    elemo.setAttribute("style", "visibility: hidden");


    let elem = await document.getElementById("cardTSS_top");
    let elem3 = await document.getElementById("slideCard");
    console.log('cardTSS_top-width: ' + elem3.offsetWidth)
    elem.setAttribute("style", "visibility: visible; width: " + elem3.offsetWidth + "px");
    let elem2 = await document.getElementById("slider");
    elem2.setAttribute("style", "visibility: hidden");


    /**
     * Actual execution of the animation, by changing the state of the animation; see @Component at line ~25
     */
    this.cardTSS_state = this.cardTSS_state == 'top' ? 'bottom' : 'top';


    if (this.cardTSS_state == 'bottom') {

      // clear interval for clock
      clearInterval();

      // reset list position, so next scroll effect can be done properly
      this.tscontent.scrollToTop();

      let elem1 = document.getElementsByClassName("even");
      elem1[0].setAttribute("style", "visibility:hidden");
      elem1[1].setAttribute("style", "visibility:hidden");

      let elemx = document.getElementsByClassName("even2");
      elemx[0].setAttribute("style", "visibility:hidden");
      elemx[1].setAttribute("style", "visibility:hidden");


      let elem21 = document.getElementsByClassName("odd");
      elem21[0].setAttribute("style", "visibility:hidden");
      elem21[1].setAttribute("style", "visibility:hidden");

      let elemx2 = document.getElementsByClassName("odd2");
      elemx2[0].setAttribute("style", "visibility:hidden");
      elemx2[1].setAttribute("style", "visibility:hidden");

      let blckr = document.getElementsByClassName("blocker");
      blckr[0].classList.remove("visible");
      blckr[0].classList.add("collapsed");
      let blckrline = document.getElementsByClassName("blocker-line");
      blckrline[0].classList.remove("visible");
      blckrline[0].classList.add("collapsed");
      let blckrttime = document.getElementsByClassName("blocker-time");
      blckrttime[0].classList.remove("visible");
      blckrttime[0].classList.add("collapsed");
    }
  }


  /**
   * Triggered if the animation finished
   * @param event data provided by the eventhandler
   */
  async animatecardtotopDone(event) {
    let animState: string = event.toState;
    if (animState == 'bottom') {

      let elem = await document.getElementById("cardTSS_top");
      elem.setAttribute("style", "visibility: hidden");
      let elem2 = await document.getElementById("slider");
      elem2.setAttribute("style", "visibility: visible");

    } else {

      setTimeout(() => {
        let elem2 = document.getElementById("root");
        elem2.setAttribute("style", "visibility: visible");

        let elem: HTMLElement = document.getElementById('segmt');
        elem.setAttribute("style", "min-width: " + (this.segmentWidth * this.days.length).toString() + "px");


        try {
          let elem1 = document.getElementsByClassName("even");
          elem1[0].setAttribute("style", "visibility:visible");
          //elem1[1].setAttribute("style", "visibility:visible");

          let elemx = document.getElementsByClassName("even2");
          elemx[0].setAttribute("style", "visibility:visible");
          //elemx[1].setAttribute("style", "visibility:visible");


          let elem21 = document.getElementsByClassName("odd");
          elem21[0].setAttribute("style", "visibility:visible");
          //elem21[1].setAttribute("style", "visibility:visible");

          let elemx2 = document.getElementsByClassName("odd2");
          elemx2[0].setAttribute("style", "visibility:visible");
          //elemx2[1].setAttribute("style", "visibility:visible");

        } catch {
          console.error('dynamic elements not rendered yet, catched by us!')
        }

        /**
         * Setting a clock timer to update the Timeslot-blocker for the passed time of the current day
         */
        this.updateClock();
        setInterval(() => {
          this.updateClock();
        }, 1000 * 60);


      }, 100);


      if (this.timeslots.length == 0) {
        this.timeslots = [{ content: 'pull to refresh', status: '' }];
      } else {
        await this.getTimeSlots(this.activeDate);
      }
    }
  }





  // * * * * * * * * * * * * * *
  // T I M E S l O T S - L I S T
  // * * * * * * * * * * * * * *

  /**
   * Logic for the times-slot blocker. Calculating the needed height and bluring timeslots 
   */
  timepixels = 0;
  timeitems = 0;
  updateClock() {

    let h = new Date().getHours();
    let m = new Date().getMinutes();

    this.currentTime = (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;

    this.timeitems = ((h - 9) * 60) + m;

    let percent = 100 / 540 * this.timeitems;
    console.log(this.timeitems);
    this.timepixels = 1328 * percent / 100;

    console.log('timeslotsrounded: ', ((this.timeitems / 20) | 0));

    if (this.timepixels >= 0 && this.timepixels <= 1328 && this.segment.value == '0') {
      try {
        let blckr = document.getElementsByClassName("blocker");
        blckr[0].setAttribute("style", "height:" + (this.timepixels) + "px;");
        let blckrline = document.getElementsByClassName("blocker-line");
        blckrline[0].setAttribute("style", "top:" + (this.timepixels) + "px;");
        let blckrttime = document.getElementsByClassName("blocker-time");
        blckrttime[0].setAttribute("style", "top:" + (this.timepixels - 12) + "px;");

        this.blurTimeSlots();

      } catch {

      }
    } else if (this.timepixels > 1328 && this.segment.value == '0') {
      let blckr = document.getElementsByClassName("blocker");
      blckr[0].setAttribute("style", "height:1328px;");
      let blckrline = document.getElementsByClassName("blocker-line");
      blckrline[0].setAttribute("style", "top:1328px;");
      let blckrttime = document.getElementsByClassName("blocker-time");
      blckrttime[0].setAttribute("style", "top:" + (1328 - 12) + "px;");

      this.blurTimeSlots();
    }
  }

  /**
   * Function to blur the relevant time-slots
   */
  blurTimeSlots() {
    if (this.timepixels >= 0 && this.timepixels <= 1328 && this.segment.value == '0') {
      try {
        if (((this.timeitems / 20) | 0) > 0 && ((this.timeitems / 20) | 0) <= 26) {
          let tselem = document.getElementsByClassName("tsitem");
          for (let t = 0; t < ((this.timeitems / 20) | 0); t++) {
            tselem[t].classList.add("blurred");
          }
        }
      } catch {

      }
    } else if (this.timepixels > 1328 && this.segment.value == '0') {
      let tselem = document.getElementsByClassName("tsitem");
      for (let t = 0; t <= 26; t++) {
        tselem[t].classList.add("blurred");
      }
    }
  }

  /**
   * Pull to Refresh on time-slots list to refresh data
   * @param event 
   */
  doRefresh(event) {
    setTimeout(() => {
      // Slowing down operation for better refresher UX
      this.getTimeSlots(this.days[this.segment.value].dateRAW);

      event.target.complete();
    }, 500);
  }
  

  /**
   * Everything relevant to show the time slots in the list, incl. all detections for free, taken, own-bookings, etc
   */
  working = false;
  getTimeSlots(date?) {

    if (this.working == true) {
      return;
    }

    this.working = true;
    /**
     * reseting relevant variables
     * IMPORTANT: 'this.timeslots' MUST have 1 item in order to avoid triggering ngIf=timeslots in ion-slides
     * @author Dave
     */
    this.timeslots = [{ content: 'pull to refresh', status: '' }]; // <--- Don't delete!!!
    this.firstSelected = -1;
    this.lastSelected = -1;
    this.userBookingsSlotsArray = [];
    this.bookedArray_Up = [];
    this.bookedArray_Down = [];
    this.bookedArray_AfterNext_Up = [];
    this.bookedArray_AfterNext_Down = [];
    this.bookedArray_Between = [];
    this.selectedCount = 0;
    this.bookingsQueue = [];


    /**
     * Getting the user-bookings data from the server
     */
    this.apiService.getUser()
      .pipe(first())
      .subscribe(
        user => {
          this.userBookingsArray = user.bookings;
          //console.log('userBookingsArray', user.bookings);

          this.findOwnBookingsForActiveCapsule();
          this.findFutureBookingsForAllCapsules();
          this.setTimeSlotsCrossCapsuleBooking();

          if (date != null) {
            this.activeDate_String = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
          }

          //this.findBookings();

          // get data for avaialble time-slots from server
          this.apiService.getCapsuleAvailability(parseInt(this.capId), this.activeDate_String).subscribe(data => {
            // data from server not formatted properly; using workaround:
            // https://stackoverflow.com/questions/85992/how-do-i-enumerate-the-properties-of-a-javascript-object
            for (var propertyName in data) {
              // propertyName is what you want
              // you can get the value like this: myObject[propertyName]

              // if-statement makes sure that data will show properly, even when corrupted on server
              if (parseInt(propertyName) > 0 && parseInt(propertyName) <= 27) {
                let tmp = {
                  content: this.timeService.getTimeRange(parseInt(propertyName), parseInt(propertyName)),
                  state: data[propertyName]
                }

                // DEBUG DATA:

                // if (
                //   //   propertyName == '1' ||
                //   // propertyName == '3' || 
                //   // propertyName == '5' || 
                //   // propertyName == '7' || 
                //   // propertyName == '10' || 
                //   propertyName == '11' ||
                //   propertyName == '12' ||
                //   propertyName == '15' ||
                //   propertyName == '16' ||
                //   propertyName == '18' || 
                //   propertyName == '19' || 

                //   // propertyName == '9' || 
                //   // propertyName == '11' || 
                //   // propertyName == '12' || 
                //   // propertyName == '13' || 
                //   // propertyName == '14' || 
                //   // propertyName == '15' || 
                //   // propertyName == '16' || 
                //   propertyName == '26') {
                //   tmp.state = 'booked';
                // }


                this.timeslots.push(tmp);
              }

            }
            //removing the dummy object from the array
            this.timeslots.splice(0, 1);


            // Setting time-slot as booked
            for (let val in this.userBookingsSlotsArray) {
              // Getting TimeSlotsValues -1 to be on array level which is starting at 0 and not at 1 like timeslots on server!
              this.timeslots[parseInt(this.userBookingsSlotsArray[val]) - 1].state = 'booked';
            }

            // Setting time-slot as crossbooked
            for (let val in this.crossCapsuleBookingsArray) {
              // Getting TimeSlotsValues -1 to be on array level which is starting at 0 and not at 1 like timeslots on server!
              this.timeslots[parseInt(this.crossCapsuleBookingsArray[val].slot) - 1].state = 'crossbooked';
              this.timeslots[parseInt(this.crossCapsuleBookingsArray[val].slot) - 1].capName = this.crossCapsuleBookingsArray[val].capName;
            }

            // Setting time-slot as blocked if option 'allowOnlyOneBooking' is set
            if (this.allowOnlyOneBooking == true && this.userBookingsSlotsArray.length > 0) {
              //console.log('userBookings: ', this.userBookingsSlotsArray);
              //console.log('userBookings: ', this.userBookingsSlotsArray[0] - 1);
              //console.log('userBookings: ', this.userBookingsSlotsArray[this.userBookingsSlotsArray.length -1] - 1);
              for (let a = 0; a < this.userBookingsSlotsArray[0] - 2; a++) {
                if (this.timeslots[a].state == true) {
                  this.timeslots[a].state = 'blocked';
                }
              }
              for (let a = this.userBookingsSlotsArray[this.userBookingsSlotsArray.length - 1] + 1; a < this.timeslots.length; a++) {
                if (this.timeslots[a].state == true) {
                  this.timeslots[a].state = 'blocked';
                }
              }
            }


            // block all slots when day limit reached
            if (this.userBookingsSlotsArray.length + this.selectedCount >= this.MAX_SLOTS_PER_DAY) {
              for (let a = 0; a < this.timeslots.length; a++) {
                if (this.timeslots[a].state == true) {
                  this.timeslots[a].state = 'blocked';
                }
              }
            }

            // if day is today, show blocker and scroll to timeslots accoring to current time
            if (this.segment.value == '0') {
              let blckr = document.getElementsByClassName("blocker");
              blckr[0].classList.remove("collapsed");
              blckr[0].classList.add("visible");
              let blckrline = document.getElementsByClassName("blocker-line");
              blckrline[0].classList.remove("collapsed");
              blckrline[0].classList.add("visible");
              let blckrttime = document.getElementsByClassName("blocker-time");
              blckrttime[0].classList.remove("collapsed");
              blckrttime[0].classList.add("visible");


              // TODO: Better reacting to a promise
              setTimeout(() => {
                this.blurTimeSlots();
              }, 300);

              // Scroll to the 
              setTimeout(() => {
                let listelem = document.getElementById('listr');

                // if ((listelem.offsetHeight*2) < this.timepixels) {
                //   this.tscontent.scrollByPoint(0, (this.timepixels + listelem.offsetHeight - 40), 1000);
                // } else {
                this.tscontent.scrollByPoint(0, (this.timepixels - 20), 1000);
                // }
              }, 500);
            } else {
              let blckr = document.getElementsByClassName("blocker");
              blckr[0].classList.remove("visible");
              blckr[0].classList.add("collapsed");
              let blckrline = document.getElementsByClassName("blocker-line");
              blckrline[0].classList.remove("visible");
              blckrline[0].classList.add("collapsed");
              let blckrttime = document.getElementsByClassName("blocker-time");
              blckrttime[0].classList.remove("visible");
              blckrttime[0].classList.add("collapsed");
            }

            // impossible time-slots: before and after a 6 time-slots booking, when 6 is the booking limit.
            this.findImpossibles();

            this.working = false;
          },
            error => {
              console.error(error);
            });
        },
        error => {
          console.error(error);
        });
  }


  /**
   * Triggered, when swiping the time-slots list horizontally finished
   * @param event 
   */
  async onIonSlideDidChange(event?) {

    this.slides.length().then(data => {
      console.log(data);
    });

    let elem = document.getElementsByClassName("even");
    elem[0].setAttribute("style", "visibility:hidden");
    elem[1].setAttribute("style", "visibility:hidden");

    let elemx = document.getElementsByClassName("even2");
    elemx[0].setAttribute("style", "visibility:visible");
    elemx[1].setAttribute("style", "visibility:visible");


    let elem2 = document.getElementsByClassName("odd");
    elem2[0].setAttribute("style", "visibility:hidden");
    elem2[1].setAttribute("style", "visibility:hidden");

    let elemx2 = document.getElementsByClassName("odd2");
    elemx2[0].setAttribute("style", "visibility:visible");
    elemx2[1].setAttribute("style", "visibility:visible");

    // this.slides.slideTo(1, 0);

  }

  /**
   * Triggered, when swiping the time-slots list horizontally to the previous slide started
   */
  slidingCount = 0;
  async onIonSlidePrevStart() {
    // console.log('prev start')

    this.slidingCount++;
    if (this.slidingCount > 1) {

      let index = await +this.segment.value;
      if (index === 0) {
        index = this.days.length;
      }
      this.segment.value = (index - 1).toString();
      this.content.scrollToPoint((index - 1) * this.segmentWidth, 0, 200);
      this.slidingCount = 0;
    }

  }

  /**
   * Triggered, when swiping the time-slots list horizontally to the previous slide ended
   */
  onIonSlidePrevEnd() {
    console.log('prev ended')

    this.tscontent.scrollToTop();
    this.slides.slideTo(1, 0);
    // console.log(this.segment.value);
    // console.log(this.days[this.segment.value].dateRAW);
    this.activeDate = this.days[this.segment.value].dateRAW;
    this.getTimeSlots(this.days[this.segment.value].dateRAW);
  }

  /**
   * Triggered, when swiping the time-slots list horizontally to the next slide started
   */
  async onIonSlideNextStart() {
    console.log('next start')
    this.slidingCount++;
    if (this.slidingCount > 1) {

      let index = await +this.segment.value;
      if (index === this.days.length - 1) {
        index = -1;
      }
      this.segment.value = (index + 1).toString();
      this.content.scrollToPoint((index + 1) * this.segmentWidth, 0, 200);

      this.slidingCount = 0;
    }
    // let index = await +this.segment.value;
    // if (index === this.daysRange - 1) {
    //   index = -1;
    // }
    // this.segment.value = (index + 1).toString();
    // this.content.scrollToPoint((index + 1) * this.segmentWidth, 0, 200);
  }

  /**
   * Triggered, when swiping the time-slots list horizontally to the next slide started
   */
  onIonSlideNextEnd() {
    //console.log('next ended')

    this.tscontent.scrollToTop();
    this.slides.slideTo(1, 0);

    // console.log(this.segment.value);
    // console.log(this.days[this.segment.value].dateRAW);
    this.activeDate = this.days[this.segment.value].dateRAW;
    this.getTimeSlots(this.days[this.segment.value].dateRAW);
  }

  /**
   * Triggered, when touching the time-slots list started
   */
  async onIonSlideTouchStart() {
    //let indexp = await this.slides.getPreviousIndex();
    let indexc = await this.slides.getActiveIndex();

    //console.log('slideindex : ' + indexc)



    if (indexc === 0 || indexc === 2) {
      let elem = document.getElementsByClassName("odd");
      //elem[0].setAttribute("name", "ios-arrow-dropleft");
      elem[0].setAttribute("style", "display:block");
      //elem[1].setAttribute("name", "ios-arrow-dropright");
      elem[1].setAttribute("style", "display:block");

      let elemx = document.getElementsByClassName("odd2");
      elemx[0].setAttribute("style", "visibility:hidden");
      elemx[1].setAttribute("style", "visibility:hidden");

      let elem2 = document.getElementsByClassName("even");
      elem2[0].setAttribute("style", "visibility:hidden");
      elem2[1].setAttribute("style", "visibility:hidden");

      // let elemx2 = document.getElementsByClassName("even2");
      // elemx2[0].setAttribute("style", "visibility:visible");
      // elemx2[1].setAttribute("style", "visibility:visible");
    } else {
      let elem = document.getElementsByClassName("even");
      elem[0].setAttribute("name", "arrow-dropleft");
      elem[0].setAttribute("style", "display:inline; float:right;");
      elem[1].setAttribute("name", "arrow-dropright");
      elem[1].setAttribute("style", "display:inline; float:left;");

      let elemx = document.getElementsByClassName("even2");
      elemx[0].setAttribute("style", "visibility:hidden");
      elemx[1].setAttribute("style", "visibility:hidden");

      let elem2 = document.getElementsByClassName("odd");
      elem2[0].setAttribute("style", "visibility:hidden");
      elem2[1].setAttribute("style", "visibility:hidden");

      // let elemx2 = document.getElementsByClassName("odd2");
      // elemx2[0].setAttribute("style", "visibility:visible");
      // elemx2[1].setAttribute("style", "visibility:visible");
    }

  }


  /**
   * This is one of the key-functions of the whole time-slot-selection.
   * This function makes sure, that the user is able to select time-slots by not exceeding the booking-limit and day-limit.
   * This functions checks whether time-slot are selectable and changes the states of the time-slots accordingly.
   * Counting the time-slots is done for direct neighbours but also the after-next ones when own (already booked) time-slots are inbetween
   * Example 1: a - Time-slots 2,4,6 are already booked by us. 
   *            b - Now selecting time-slot 5; Expected result: slot 3 and slot 7 should be now selectable, because 3 and 7 are the next possible ones
   *            c - Now selecting time-slot 3; Expected result: slot 1 and slot 7 should be now selectable
   *            d - now selecting time-slot 7; Expected result: slot 1 and slot 8 should be NOT selectable, because limit of 6 times-lots (2,3,4,5,6,7) in a row reached
   * 
   * Example 2: a - Time-slots 2,4,6,7,8,9,10, are already booked by us. 
   *            b - Now selecting time-slot 3; Expected result: slot 1 should be now selectable and slot 5 NOT, because selecting slot 5 would exceed the limit
   * 
   */
  onTimeSlotClick(i) {

    //console.log(this.userBookingsSlotsArray);
    //console.clear();
    this.bookedArray_Up = [];
    this.bookedArray_Down = [];
    this.bookedArray_AfterNext_Up = [];
    this.bookedArray_AfterNext_Down = [];
    this.bookedArray_Between = [];


    // mark all free slots as blocked
    for (let a = 0; a < this.timeslots.length; a++) {
      if (this.timeslots[a].state == true) {
        this.timeslots[a].state = 'blocked';
      }
    }

    // handling selecting & unselecting slots
    if (this.firstSelected == -1) {
      this.firstSelected = i;
      this.lastSelected = i;
      this.selectedCount++;
    } else if (i < this.firstSelected) {
      this.firstSelected = i;
      this.selectedCount++;
    } else if (i > this.lastSelected) {
      this.lastSelected = i;
      this.selectedCount++;
    } else if (i == this.firstSelected) {
      console.log('unselecting first');
      let c_down = 1;
      if (this.lastSelected < this.timeslots.length - 2 && this.timeslots[i + c_down].state == 'booked') {
        while (this.timeslots[i + c_down].state == 'booked') {
          console.log('unselected first down' + this.bookedArray_Down);

          var index = this.bookedArray_Down.indexOf(i + c_down);
          if (index > -1) {
            this.bookedArray_Down.splice(index, 1);
          }
          c_down++;
        }
      }
      this.firstSelected = i + c_down;
      this.selectedCount--;
      if (this.timeslots[i].state == 'selected') {
        this.timeslots[i].state = true;
      }

      let c_up = 1;
      if (this.firstSelected > 1 && this.timeslots[i - c_up].state == 'booked') {
        while (this.firstSelected - c_up >= 1 && this.timeslots[i - c_up].state == 'booked') {
          console.log('unselected first up' + this.bookedArray_Up);

          var index = this.bookedArray_Up.indexOf(i - c_up);
          if (index > -1) {
            this.bookedArray_Up.splice(index, 1);
          }
          c_up++;
        }
      }


    } else if (i == this.lastSelected) {
      console.log('unselecting last');
      let c_up = 1;
      if (this.firstSelected > 1 && this.timeslots[i - c_up].state == 'booked') {
        while (this.timeslots[i - c_up].state == 'booked') {
          console.log('unselected last up' + this.bookedArray_Up);

          var index = this.bookedArray_Up.indexOf(i - c_up);
          if (index > -1) {
            this.bookedArray_Up.splice(index, 1);
          }
          c_up++;
        }
      }
      this.lastSelected = i - c_up;
      this.selectedCount--;
      if (this.timeslots[i].state == 'selected') {
        this.timeslots[i].state = true;
      }

      let c_down = 1;
      if (i < this.timeslots.length && this.timeslots[i + c_down].state == 'booked') {
        console.log("heretrue");
        while (this.lastSelected + c_down < this.timeslots.length - 1 && this.timeslots[i + c_down].state == 'booked') {
          console.log('unselected last down' + this.bookedArray_Down);

          var index = this.bookedArray_Down.indexOf(i + c_down);
          if (index > -1) {
            this.bookedArray_Down.splice(index, 1);
          }
          c_down++;
        }
      }


    }


    // mark selected slots as selected
    for (let s = this.firstSelected; s <= this.lastSelected; s++) {
      //console.log('selected: ' + s);
      if (this.timeslots[s].state != 'booked') {
        this.timeslots[s].state = 'selected';
      }
    }


    // count booked between first and last selected
    for (let s = this.firstSelected; s <= this.lastSelected; s++) {
      if (this.timeslots[s].state == 'booked') {
        this.addItem('between', s);
      }
    }


    // mark 1 slot before and 1 slot after selected as free to extend selection, all other free ones are blocked
    if (this.firstSelected > 0 &&
      this.timeslots[this.firstSelected - 1].state == 'blocked') {
      this.timeslots[this.firstSelected - 1].state = true;
    }
    if (this.lastSelected < this.timeslots.length - 1 &&
      this.timeslots[this.lastSelected + 1].state == 'blocked') {
      this.timeslots[this.lastSelected + 1].state = true;
    }



    let c_booked_up = 1;;
    let c2_booked_up = 1;


    // handle booked slots upwards
    if (this.firstSelected > 0 && this.timeslots[this.firstSelected - 1].state == 'booked') {

      c_booked_up = 1;
      while (this.firstSelected - c_booked_up >= 0 && this.timeslots[this.firstSelected - c_booked_up].state == 'booked') {
        this.addItem('booked_up', this.firstSelected - c_booked_up);
        c_booked_up++;
      }

      // if (this.firstSelected > 0 && this.firstSelected - c_booked_up >= 0 &&
      //   this.selectedCount + this.bookedArray_Down.length + this.bookedArray_Up.length + this.bookedArray_Between.length < this.MAX_SLOTS_PER_BOOKING &&
      //   this.timeslots[this.firstSelected - c_booked_up].state == 'blocked') {
      //   this.timeslots[this.firstSelected - c_booked_up].state = true;
      // }

      if (this.firstSelected > 1 && this.firstSelected - (c_booked_up + 1) > 0 &&
        this.timeslots[this.firstSelected - c_booked_up].state == 'blocked' &&
        this.timeslots[this.firstSelected - (c_booked_up + 1)].state == 'booked') {

        c2_booked_up = c_booked_up;

        while (this.firstSelected - c2_booked_up > 0 &&
          this.timeslots[this.firstSelected - (c2_booked_up + 1)].state == 'booked') {
          this.addItem('booked_afternext_up', this.firstSelected - (c2_booked_up + 1));
          c2_booked_up++;
        }


        // if ((this.selectedCount + this.bookedArray_Up.length + this.bookedArray_Down.length + this.bookedArray_AfterNext_Up.length + this.bookedArray_Between.length) >= 5) {
        //   if (this.timeslots[this.firstSelected - c_booked_up].state == true) {
        //     this.timeslots[this.firstSelected - c_booked_up].state = 'blocked';
        //   }
        // }
      }
    }



    // - - - - - - - - - - - - - - - - - - - - - - - - - -

    let c_booked_down = 1;
    let c2_booked_down = 1;
    // handle booked slots downwards
    if (this.lastSelected < this.timeslots.length - 1 && this.timeslots[this.lastSelected + 1].state == 'booked') {

      c_booked_down = 1;
      while (this.lastSelected + c_booked_down < this.timeslots.length && this.timeslots[this.lastSelected + c_booked_down].state == 'booked') {
        this.addItem('booked_down', this.lastSelected + c_booked_down);
        c_booked_down++;
      }
      //console.log('booked down c: ' + c_booked_down);

      // if (this.lastSelected < this.timeslots.length - 1 && this.lastSelected + c_booked_down < this.timeslots.length &&
      //   this.selectedCount + this.bookedArray_Down.length + this.bookedArray_Up.length + this.bookedArray_Between.length < this.MAX_SLOTS_PER_BOOKING &&
      //   this.timeslots[this.lastSelected + c_booked_down].state == 'blocked') {
      //   this.timeslots[this.lastSelected + c_booked_down].state = true;
      // }


      if (this.lastSelected < this.timeslots.length - 2 &&
        this.timeslots[this.lastSelected + c_booked_down].state == 'blocked' &&
        this.timeslots[this.lastSelected + c_booked_down + 1].state == 'booked') {

        c2_booked_down = c_booked_down;
        while (this.lastSelected + c2_booked_down < this.timeslots.length - 2 &&
          this.timeslots[this.lastSelected + c2_booked_down + 1].state == 'booked') {
          //console.log(c2 + ': ' + this.timeslots[this.lastSelected + c2].state);
          this.addItem('booked_afternext_down', this.lastSelected + c2_booked_down + 1);
          c2_booked_down++;
        }


        // if ((this.selectedCount + this.bookedArray_Up.length + this.bookedArray_Down.length + this.bookedArray_AfterNext_Down.length + this.bookedArray_Between.length) >=5) {
        //   if (this.timeslots[this.lastSelected + c_booked_down].state == true) {
        //     this.timeslots[this.lastSelected + c_booked_down].state = 'blocked';
        //   }
        // }

      }
    }





    if (this.firstSelected > 0 && this.firstSelected - c_booked_up >= 0 &&
      this.selectedCount +
      this.bookedArray_Down.length +
      this.bookedArray_Up.length +
      this.bookedArray_Between.length < this.MAX_SLOTS_PER_BOOKING &&
      this.timeslots[this.firstSelected - c_booked_up].state == 'blocked') {
      this.timeslots[this.firstSelected - c_booked_up].state = true;
    }

    if (this.firstSelected - c_booked_up >= 0 &&
      (this.selectedCount +
        this.bookedArray_Up.length +
        this.bookedArray_Down.length +
        this.bookedArray_AfterNext_Up.length +
        this.bookedArray_Between.length) > 5) {
      if (this.timeslots[this.firstSelected - c_booked_up].state == true) {
        this.timeslots[this.firstSelected - c_booked_up].state = 'blocked';
      }
    }




    if (this.lastSelected < this.timeslots.length - 1 && this.lastSelected + c_booked_down < this.timeslots.length &&
      this.selectedCount +
      this.bookedArray_Down.length +
      this.bookedArray_Up.length +
      this.bookedArray_Between.length < this.MAX_SLOTS_PER_BOOKING &&
      this.timeslots[this.lastSelected + c_booked_down].state == 'blocked') {
      this.timeslots[this.lastSelected + c_booked_down].state = true;
    }

    if (this.lastSelected + c_booked_down < this.timeslots.length &&
      (this.selectedCount +
        this.bookedArray_Up.length +
        this.bookedArray_Down.length +
        this.bookedArray_AfterNext_Down.length +
        this.bookedArray_Between.length) > 5) {
      if (this.timeslots[this.lastSelected + c_booked_down].state == true) {
        this.timeslots[this.lastSelected + c_booked_down].state = 'blocked';
      }
    }



    //AFTER NEXT UP: selected -> free -> booked
    if (this.firstSelected > 0 && this.timeslots[this.firstSelected - 1].state == true) {
      console.log('AFTER NEXT UP');
      let c = 1;
      if (this.firstSelected > 1 &&
        this.timeslots[this.firstSelected - c].state == true &&
        this.timeslots[this.firstSelected - (c + 1)].state == 'booked') {

        let c2 = c;
        while (this.firstSelected - c2 > 0 &&
          this.timeslots[this.firstSelected - c2 - 1].state == 'booked') {
          //console.log(c2 + ': ' + this.timeslots[this.firstSelected - c2].state);
          this.addItem('booked_afternext_up', this.firstSelected - c2 - 1);
          c2++;
        }

        if ((this.selectedCount + this.bookedArray_Up.length + this.bookedArray_Down.length + this.bookedArray_AfterNext_Up.length + this.bookedArray_Between.length) > 5) {
          if (this.timeslots[this.firstSelected - c].state == true) {
            this.timeslots[this.firstSelected - c].state = 'blocked';
          }
        }
      }
    }

    // AFTER NEXT down
    if (this.lastSelected < this.timeslots.length - 1 && this.timeslots[this.lastSelected + 1].state == true) {
      let c = 1;
      if (this.lastSelected < this.timeslots.length - 2 &&
        this.timeslots[this.lastSelected + c].state == true &&
        this.timeslots[this.lastSelected + c + 1].state == 'booked') {

        let c2 = c;
        while (this.lastSelected + c2 < this.timeslots.length - 2 &&
          this.timeslots[this.lastSelected + c2 + 1].state == 'booked') {
          //console.log(c2 + ': ' + this.timeslots[this.lastSelected + c2].state);
          this.addItem('booked_afternext_down', this.lastSelected + c2 + 1);
          c2++;
        }
        //console.log('booked down c2: ' + c2);
        if ((this.selectedCount + this.bookedArray_Up.length + this.bookedArray_Down.length + this.bookedArray_AfterNext_Down.length + this.bookedArray_Between.length) > 5) {
          if (this.timeslots[this.lastSelected + c].state == true) {
            this.timeslots[this.lastSelected + c].state = 'blocked';
          }
        }
      }
    }


    // console.log('first: ' + this.firstSelected);
    // console.log('last: ' + this.lastSelected);
    // console.log('selectedCount: ' + this.selectedCount);
    // console.log('up after: ' + this.bookedArray_AfterNext_Up.length + ': ', this.bookedArray_AfterNext_Up);
    // console.log('up: ' + this.bookedArray_Up.length + ': ', this.bookedArray_Up);
    // console.log('between: ' + this.bookedArray_Between.length + ': ', this.bookedArray_Between);
    // console.log('down: ' + this.bookedArray_Down.length + ': ', this.bookedArray_Down);
    // console.log('down after: ' + this.bookedArray_AfterNext_Down.length + ': ', this.bookedArray_AfterNext_Down);
    // console.log('total: ', this.selectedCount +
    //   this.bookedArray_Up.length +
    //   this.bookedArray_Down.length +
    //   this.bookedArray_AfterNext_Up.length +
    //   this.bookedArray_AfterNext_Down.length +
    //   this.bookedArray_Between.length);
    // console.log('totalcore: ', this.selectedCount +
    //   this.bookedArray_Up.length +
    //   this.bookedArray_Down.length +
    //   this.bookedArray_Between.length);



    // blocke all slots when day limit reached
    if (this.userBookingsSlotsArray.length + this.selectedCount >= this.MAX_SLOTS_PER_DAY) {
      for (let a = 0; a < this.timeslots.length; a++) {
        if (this.timeslots[a].state == true) {
          this.timeslots[a].state = 'blocked';
        }
      }
    }

    // Display minutes with leading zero
    // Soure: https://stackoverflow.com/questions/8935414/getminutes-0-9-how-to-display-two-digit-numbers

    let date = new Date();
    let date2 = this.days[this.segment.value].dateRAW;
    let currentTime = date.getHours() + '' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    //log('TIME CURRENT: ',currentTime);
    //console.log('TIME SELECTED: ',this.timeService.getStartTime(i + 1).replace(':', ''));

    if ((date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() == date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate()) &&
      (this.firstSelected == i) && parseInt(currentTime) >= parseInt(this.timeService.getStartTime(i + 1).replace(':', ''))) {
      this.presentAlert_TS_Active();
    }





    // mark all blocked as free if no slot is selected
    if (this.selectedCount == 0) {
      for (let a = 0; a < this.timeslots.length; a++) {
        if (this.timeslots[a].state == 'blocked') {
          this.timeslots[a].state = true;
        }
      }
      this.firstSelected = -1;
      this.lastSelected = -1;
      this.bookedArray_Up = [];
      this.bookedArray_Down = [];
      this.bookedArray_AfterNext_Up = [];
      this.bookedArray_AfterNext_Down = [];
      this.bookedArray_Between = [];

      if (this.allowOnlyOneBooking == true && this.userBookingsSlotsArray.length > 0) {
        for (let a = 0; a < this.userBookingsSlotsArray[0] - 2; a++) {
          try {
            if (this.timeslots[a].state == true) {
              this.timeslots[a].state = 'blocked';
            }
          } catch {
            console.error('catched by us, out of bounds as expected');
          }

        }
        for (let a = this.userBookingsSlotsArray[this.userBookingsSlotsArray.length - 1] + 1; a < this.timeslots.length; a++) {
          try {
            if (this.timeslots[a].state == true) {
              this.timeslots[a].state = 'blocked';
            }
          } catch {
            console.error('catched by us, out of bounds as expected');
          }
        }
      }

    }


    setTimeout(() => {
      this.blurTimeSlots();
    }, 100);

  }


  // Helper function to add time-slot indexes to specitfic array, and avoid duplicates
  // https://stackoverflow.com/questions/1988349/array-push-if-does-not-exist
  addItem(array, item) {
    if (array == 'booked_afternext_up') {
      var i = this.bookedArray_Up.findIndex(x => x == item);
      if (i === -1) {
        var index = this.bookedArray_AfterNext_Up.findIndex(x => x == item);
        if (index === -1) {
          this.bookedArray_AfterNext_Up.push(item);
        }
      }
    } else if (array == 'booked_afternext_down') {
      var i = this.bookedArray_Down.findIndex(x => x == item);
      if (i === -1) {
        var index = this.bookedArray_AfterNext_Down.findIndex(x => x == item);
        if (index === -1) {
          this.bookedArray_AfterNext_Down.push(item);
        }
      }
    } else if (array == 'booked_up') {
      var i = this.bookedArray_AfterNext_Up.findIndex(x => x == item);
      if (i === -1) {
        var index = this.bookedArray_Up.findIndex(x => x == item);
        if (index === -1) {
          this.bookedArray_Up.push(item);
        }
      }
    } else if (array == 'booked_down') {
      var i = this.bookedArray_AfterNext_Down.findIndex(x => x == item);
      if (i === -1) {
        var index = this.bookedArray_Down.findIndex(x => x == item);
        if (index === -1) {
          this.bookedArray_Down.push(item);
        }
      }
    } else if (array == 'between') {
      var index = this.bookedArray_Between.findIndex(x => x == item);
      var u = this.bookedArray_Up.findIndex(x => x == item);
      var u2 = this.bookedArray_AfterNext_Up.findIndex(x => x == item);
      var d = this.bookedArray_Down.findIndex(x => x == item);
      var d2 = this.bookedArray_AfterNext_Down.findIndex(x => x == item);

      if (index === -1 && u === -1 && u2 === -1 && d === -1 && d2 === -1) {
        this.bookedArray_Between.push(item);
      }
    }

    // else {
    //   console.log("object already exists")
    // }
  }


  // Show a warning if start-time of the selected time-slot is already in the past
  async presentAlert_TS_Active() {
    const alert = await this.alertController.create({
      mode: 'md',
      cssClass: 'alert-dialog',
      header: this.translateService.instant('WARNING'),
      message: this.translateService.instant('WARNING_SLOTACTIVE'),
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }
      ]
    });
    await alert.present();
  }




  
  // * * * * * * * *
  // C H E C K O U T
  // * * * * * * * *

  proceedToCheckoutClick() {
    this.createBookings();
    this.presentCheckOutModal();
  }
  async presentCheckOutModal() {
    const modal = await this.modalController.create({
      component: CheckoutModalPage,
      componentProps: {
        paymentAmount: this.selectedCount * this.PRICE_PER_SLOT,
        timeStart: this.timeService.getStartTime(this.firstSelected + 1),
        timeEnd: this.timeService.getEndTime(this.lastSelected + 1),
        date: this.activeDate_String,
        capsule: this.capName
      },
      cssClass: 'password-changer-modal'
    });

    modal.onDidDismiss().then(value => {
      if (typeof value.data == 'string') {
        this.paymentID = value.data;
        //this.toast("Paypal payment successful, sending data to Server..");
        let today = new Date()
        let dateTime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " +
          today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        this.localNotifications.schedule({
          id: parseInt(this.capId),
          title: this.translateService.instant('NOTIFICATION_PAYPAL_SUCCESS'),
          icon: 'https://mobappex.web.app/assets/icon/favicon.png',
          // tslint:disable-next-line:max-line-length
          text: this.translateService.instant('NOTIFICATION_PAYPAL_AT') + dateTime + this.translateService.instant('NOTIFICATION_PAYPAL_BOOKED') + this.capName + this.translateService.instant('NOTIFICATION_PAYPAL_FOR') + this.selectedCount * this.PRICE_PER_SLOT + '€'
        });
        // loop through bookingsQueue
        for (let b = 0; b < this.bookingsQueue.length; b++) {
          this.apiService.bookCapsule(
            parseInt(this.capId), //Casule Id
            this.activeDate_String, // Date
            this.bookingsQueue[b].first, // First slot
            this.bookingsQueue[b].last, // Last slot
            'PayPal', // Vendor
            this.bookingsQueue[b].slotsCount * this.PRICE_PER_SLOT, // Amount
            true, // Verified
            this.paymentID // Paypal Payment id
          ).subscribe(data => {

            if (b == this.bookingsQueue.length - 1) {
              this.apiService.getUser()
                .pipe(first())
                .subscribe(
                  user => {
                    this.userBookingsArray = user.bookings;
                    console.log(user.bookings);
                    this.findOwnBookingsForActiveCapsule();
                    this.getTimeSlots(this.days[this.segment.value].dateRAW);
                  },
                  error => {
                    console.log(error);
                  });


              this.toast(this.translateService.instant('BOOKED') + this.capName);
              console.log(data);
            }

          }, err => {
            console.log(err)
            this.toast(err);
          });
        }

        // this.apiService.bookCapsule(
        //   parseInt(this.capId),
        //   this.activeDate_String,
        //   this.firstSelected + 1,
        //   this.lastSelected + 1,
        //   'PayPal',
        //   this.selectedCount,
        //   true,
        //   this.paymentID
        // ).subscribe(data => {
        //   // TODO: this.getUserBookings();
        //   this.getTimeSlots(this.activeDate);
        //   this.toast("booked: " + this.capName);
        //   console.log(data);
        // }, err => {
        //   console.log(err)
        //   this.toast(err);
        // });
      }
    });

    return await modal.present();
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

  canProceedCheckout(): boolean {
    if (this.selectedCount > 0 && this.selectedCount <= this.MAX_SLOTS_PER_BOOKING) {
      return true;
    } else {
      return false;
    }
  }




  
  // * * * * * * * *
  // B O O K I N G S
  // * * * * * * * *

  async getUserBookings() {
    await this.apiService.getUser()
      .pipe(first())
      .subscribe(
        user => {
          this.userBookingsArray = user.bookings;
          //console.log('userBookingsArray @ getUserBookings()', user.bookings);
          this.findOwnBookingsForActiveCapsule();
          this.findFutureBookingsForAllCapsules();
        },
        error => {
          console.log(error);
        });
  }

  // analyzes the time slot selction and splits it into single bookings if already booked slots are inbetween this selection
  createBookings() {

    this.bookingsQueue = [];
    let selection = [];


    for (let i = this.firstSelected; i <= this.lastSelected; i++) {
      if (this.userBookingsSlotsArray.indexOf(i + 1) == -1) {
        selection.push(i + 1);
      }
    }

    for (let s = 0; s < selection.length; s++) {
      let booking = {
        first: 0,
        last: 0,
        slotsCount: 0
      }
      booking.first = selection[s];
      booking.slotsCount = 1;
      while (((selection[s]) + 1) == (selection[s + 1])) {
        booking.slotsCount++;
        s++;
      }

      booking.last = selection[s];
      this.bookingsQueue.push(booking);

    }
    // console.log(this.bookingsQueue);
  }

  findFutureBookingsForAllCapsules() {

    this.futureBookings = [];
    for (let b = 0; b < this.userBookingsArray.length; b++) {

      let date = new Date(this.userBookingsArray[b].Date);
      let dateToday = new Date();

      let futureBooking = {
        date: new Date(this.userBookingsArray[b].Date).toISOString(),
        startingTime: this.timeService.getEndTime(this.userBookingsArray[b].FirstTimeFrame),
        endingTime: this.timeService.getEndTime(this.userBookingsArray[b].LastTimeFrame),
        capsuleId: this.userBookingsArray[b].Capsule_id
      }

      // let bookingStartDate = new Date(this.userBookingsArray[b].Date);
      // bookingStartDate.setHours(futureBooking.startingTime.split(':')[0]);
      // bookingStartDate.setMinutes(futureBooking.startingTime.split(':')[0]);

      // Source: tab1.page.ts, author: Chi
      if (date > dateToday) {
        this.futureBookings.push(futureBooking);
      } else if (date.getDate() == dateToday.getDate()) {
        let hourNow = new Date().getHours();
        let endTime = futureBooking.endingTime.split(':');
        // compare the hours, if bigger then add to future booking
        if (endTime[0] > hourNow) {
          this.futureBookings.push(futureBooking);
          // if same hour, compare minutes
        } else if (endTime[0] == hourNow) {
          if (endTime[1] >= new Date().getMinutes()) {
            this.futureBookings.push(futureBooking);
          }
        }
      }

      //if(new Date(this.userBookingsArray[b].Date).setHours(futureBooking.startingTime.split(':')[0]))
      //let date = new Date(this.userBookingsArray[b].Date);
      //console.log(bookingStartDate.toISOString());
    }
    // console.log('future: ', this.futureBookings);
    this.setBookedLabel()
  }

  // finds own bookings to mark time slots as YOURS
  findOwnBookingsForActiveCapsule() {
    //let datestring = this.activeDate.getFullYear().toString() + (this.activeDate.getMonth() + 1).toString() + this.activeDate.getDate().toString();
    let datestring = this.days[this.segment.value].dateRAW.getFullYear().toString() + (this.days[this.segment.value].dateRAW.getMonth() + 1).toString() + this.days[this.segment.value].dateRAW.getDate().toString();

    //console.log(this.activeDate.getFullYear().toString()+(this.activeDate.getMonth()+1).toString()+ this.activeDate.getDate().toString());
    for (let a = 0; a < this.userBookingsArray.length; a++) {

      let date = new Date(Date.parse(this.userBookingsArray[a].Date));
      //console.log(date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDate().toString() + ':' + datestring);
      //console.log(this.userBookingsArray[a].Capsule_id + ':' + this.capId);
      if (this.userBookingsArray[a].Capsule_id == this.capId && datestring == date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDate().toString()) {
        this.addBookedSlot(this.userBookingsArray[a].FirstTimeFrame);
        this.addBookedSlot(this.userBookingsArray[a].LastTimeFrame);

        for (let s = this.userBookingsArray[a].FirstTimeFrame + 1; s <= this.userBookingsArray[a].LastTimeFrame - 1; s++) {
          this.addBookedSlot(s);
        }
      }
    }
    //console.log('userBookingsSlotsArray', this.userBookingsSlotsArray);
  }

  // Impossibles are time slots above or below a timeslots-group that reaches the maximums booking limit
  findImpossibles() {

    // sort slot numbers to be in line
    this.userBookingsSlotsArray.sort(this.compare_Numbers);

    let impossibles = [];
    for (let s = 0; s < this.userBookingsSlotsArray.length; s++) {

      while ((((this.userBookingsSlotsArray[s])) == (this.userBookingsSlotsArray[s + 1] - 1))) {
        console.log('hello: ', this.userBookingsSlotsArray[s]);

        let index = impossibles.findIndex(x => x == this.userBookingsSlotsArray[s])
        if (index === -1) {
          impossibles.push(this.userBookingsSlotsArray[s]);
        }

        let index2 = impossibles.findIndex(x => x == this.userBookingsSlotsArray[s + 1])
        if (index2 === -1) {
          impossibles.push(this.userBookingsSlotsArray[s + 1]);
        }

        s++;
      }

      if (impossibles.length >= this.MAX_SLOTS_PER_BOOKING) {

        try {
          this.timeslots[impossibles[0] - 2].state = 'impossible';
        } catch {

        }
        try {
          this.timeslots[impossibles[impossibles.length - 1]].state = 'impossible';
        } catch {

        }
      }

      impossibles = [];
    }
  }
  addBookedSlot(item) {
    var index = this.userBookingsSlotsArray.findIndex(x => x == item)
    if (index === -1) {
      this.userBookingsSlotsArray.push(item);
    }
  }

  // finding own bookings to prevent booking another capsule at the same time as already booked a capsule.
  crossCapsuleBookingsArray = [];
  setTimeSlotsCrossCapsuleBooking() {
    this.crossCapsuleBookingsArray = [];

    let date = this.days[this.segment.value].dateRAW;

    for (let b in this.userBookingsArray) {
      let date2 = new Date(this.userBookingsArray[b].Date);

      if (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() == date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate() && this.userBookingsArray[b].Capsule_id != this.capId) {
        //console.log(this.userBookingsArray[b]);
        //console.log(this.userBookingsArray[b].capsule.Name);

        let crossCapsuleBooking = {
          capName: this.userBookingsArray[b].capsule.Name,
          slot: this.userBookingsArray[b].FirstTimeFrame
        }
        this.addBookedCapsuleSlot(crossCapsuleBooking);

        let crossCapsuleBooking2 = {
          capName: this.userBookingsArray[b].capsule.Name,
          slot: this.userBookingsArray[b].LastTimeFrame
        }
        this.addBookedCapsuleSlot(crossCapsuleBooking2);

        for (let s = this.userBookingsArray[b].FirstTimeFrame + 1; s <= this.userBookingsArray[b].LastTimeFrame - 1; s++) {
          let crossCapsuleBooking3 = {
            capName: this.userBookingsArray[b].capsule.Name,
            slot: s
          }
          this.addBookedCapsuleSlot(crossCapsuleBooking3);
        }
      }
    }
    // console.log('crossCapsuleBookingsArray', this.crossCapsuleBookingsArray);

  }
  addBookedCapsuleSlot(item) {
    var index = this.crossCapsuleBookingsArray.findIndex(x => x.slot == item.slot)
    if (index === -1) {
      this.crossCapsuleBookingsArray.push(item);
    }
  }




  
  // * * * * * * * * * * * * * * * * * * * * * * * *
  // C A L E N D A R / D A T E P I C K E R / D A Y S
  // * * * * * * * * * * * * * * * * * * * * * * * *

  async onDatePickerChanged(value) {
    console.log(value);

    this.tscontent.scrollToTop();

    let date;
    let datePortions;
    let lang = await this.storage.get('language');
    switch (lang) {
      case 'en':
        datePortions = value.split('/');
        date = new Date(datePortions[2], datePortions[0] - 1, datePortions[1]);
        break;
      case 'de':
        datePortions = value.split('.');
        date = new Date(datePortions[2], datePortions[1] - 1, datePortions[0]);
        break;
    }


    let diff = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(this.days[this.segment.value].dateRAW.getFullYear(), this.days[this.segment.value].dateRAW.getMonth(), this.days[this.segment.value].dateRAW.getDate())) / (1000 * 60 * 60 * 24));

    let index = await +this.segment.value;

    this.segment.value = (index + diff).toString();
    this.content.scrollToPoint((index + diff) * this.segmentWidth, 0, 200);

    this.getTimeSlots(this.days[this.segment.value].dateRAW);



  }

  async setDatePickerFormat() {
    let value = await this.storage.get('language');
    switch (value) {
      case 'en':
        this._adapter.setLocale('en');

        // set first weekday to monday in datepicker
        // https://stackoverflow.com/questions/45057191/angular-4-material-2-md-datepicker-set-first-day-of-the-week
        this._adapter.getFirstDayOfWeek = () => { return 1; };
        break;
      case 'de':
        this._adapter.setLocale('de');

        // set first weekday to monday in datepicker
        // https://stackoverflow.com/questions/45057191/angular-4-material-2-md-datepicker-set-first-day-of-the-week
        this._adapter.getFirstDayOfWeek = () => { return 1; };
        break;
    }
  }

  /**
   * Executed when clicked on a day above the time-slots-list
   * @param day 
   */
  onSegmentClick(day) {
    // scroll time-slot-list-content to top
    this.tscontent.scrollToTop();

    let date = new Date();
    date.setDate(date.getDate() + parseInt(day.value));

    this.activeDate = date;
    this.getTimeSlots(day.dateRAW);
  }





  
  // * * * * * * * * * * * * * *
  // S O R T I N G - H E L P E R
  // * * * * * * * * * * * * * *

  // Quelle: Javascript - Das umfassende Handbuch, Rheinwerk Verlag
  compare_Numbers(value1, value2) {
    if (value1 < value2) {
      return -1; // Der erste Wert ist kleiner als der zweite Wert.
    } else if (value1 > value2) {
      return 1; // Der erste Wert ist größer als der zweite Wert.
    } else {
      return 0; // Beide Werte sind gleich groß.
    }
  }

  compare_Distance(value1, value2) {
    if (value1.calculatedDistance < value2.calculatedDistance) {
      return -1; // Der erste Wert ist kleiner als der zweite Wert.
    } else if (value1.calculatedDistance > value2.calculatedDistance) {
      return 1; // Der erste Wert ist größer als der zweite Wert.
    } else {
      return 0; // Beide Werte sind gleich groß.
    }
  }



  // * * * * * * * * * * *
  // G O O G L E - M A P S
  // * * * * * * * * * * *

  /**
   * Retrieve the current GPS position, recalclate distances and sort capsules list accordingly
   */
  getPositionClick() {
    this.spinBtnPositionPressed = true;
    this.locationService.getCurrentPosition().then(data => {
      console.log('Result getting location in Component', data);
      this.latMapCenter = data.coords.latitude;
      this.lngMapCenter = data.coords.longitude;

      this.spinBtnPositionPressed = false;

      for (let cap in this.capsules) {
        this.capsules[cap].calculatedDistance = this.locationService.getDistanceFromLatLonInKm(this.latMapCenter, this.lngMapCenter, this.capsules[cap].Latitude, this.capsules[cap].Longitude);
      }
      this.capsules.sort(this.compare_Distance);
    }).catch((error) => {
      console.log('Error getting location', error);
      this.spinBtnPositionPressed = false;
    });
  }

  /**
   * 
   * @param label text of the marker
   * @param index of the marker
   */
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
    this.hideAllMarkerPopUs();
    this.slider.slideTo(index);
  }

  /**
   * Hides/closes all marker popups on the map
   */
  hideAllMarkerPopUs() {
    for (const item of this.capsules) {
      item.isOpen = false;
    }
  }

  /**
   * Triggered if map was moved; could be used to determine which capsules are visible on the map 
   * and filter the capsules list, the user can choose capsukes from.
   * @param event inforamtion about map bounds
   */
  onBoundsChanged(event?) {
    //console.log(event);
  }

  // Source: https://mapstyle.withgoogle.com/
  mapDarkStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8ec3b9"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1a3646"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#64779e"
        }
      ]
    },
    {
      "featureType": "administrative.province",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#334e87"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6f9ba5"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3C7680"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#304a7d"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2c6675"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#255763"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#b0d5ce"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3a4762"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#0e1626"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#4e6d70"
        }
      ]
    }
  ]





}
