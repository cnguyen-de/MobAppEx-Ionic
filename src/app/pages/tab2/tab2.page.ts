import { map } from 'rxjs/operators';
import { Component, ViewChild, OnInit } from "@angular/core";
import { IonSlides, IonSegment, IonContent, Platform, ModalController, ToastController } from '@ionic/angular';
import { LocationService } from '../../_services/location.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ApiService } from '../../_services/api/api.service';
import { TimeService } from '../../_services/time/time.service';
import { AgmMap, AgmCoreModule } from '@agm/core';
import { LightModalPage } from '../../modals/light-modal/light-modal.page';
import { CheckoutModalPage } from '../../modals/checkout-modal/checkout-modal.page';
import { first } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

import { booking } from '../../_services/booking';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import isEqual from 'lodash.isequal';
import {MatDatepicker} from '@angular/material/datepicker';

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
    private localNotifications: LocalNotifications,
    private _adapter: DateAdapter<any>) { }

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
  excludeSundays = false;
  days = [];
  daysRange: number = 30;

  // Current Time
  currentTime;

  //Timeslots
  timeslots = [];
  segmentWidth: number = 100;

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

  test = false;

  minDate = new Date();
  maxDate = new Date();
  datePickerFilter: any;

  ngOnInit() {

    // Set current date
    let currentDate = new Date();
    console.log(currentDate);

    this.maxDate.setDate(currentDate.getDate() + this.daysRange - 1);


    this.activeDate_String = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();

    //Create 30 days for days-segment
    for (let i = 0; i < this.daysRange; i++) {
      var date = new Date();
      date.setDate(date.getDate() + i);

      let formattedDate = new Intl.DateTimeFormat('en-US', {
        // weekday: 'short',
        month: 'short',
        day: '2-digit'
      }).format(date);

      if (i == 0) {
        formattedDate = 'Today';
      } else if (i == 1) {
        formattedDate = 'Tomorrow';
      }
      let day = {
        dateRAW: date,
        date: formattedDate,
        value: i.toString()
      }
      if(this.excludeSundays == true) {
        if(day.dateRAW.getDay() != 0) {
        this.days.push(day);          
        }
      } else {
        this.days.push(day);
      }
    }

    
    if(this.excludeSundays == true) {
      // for (let i = 0; i < this.days.length; i++) {
      //   if(this.days[i].dateRAW.getDay() == 0) {
      //     this.days.splice(i, 1);
      //   }
      // }

      this.datePickerFilter = (d: Date): boolean => {
        const day = d.getDay();
        // Prevent Saturday and Sunday from being selected.
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



    this.platform.backButton.subscribe(() => {
      if(this.picker.opened == true) {
        this.picker.close();
      }
      else if (this.cardTSS_state == 'top') {
        this.animateTSS_Click();
      }
    });

  }


  ionViewDidEnter() {
    // this.storage.get('futureBookings').then(bookings => {
    //   try {
    //     this.futureBookings = bookings;
    //   } catch {
    //     console.error('Error getting future bookings');
    //   }

    // });

    this.storage.get('dark').then(dark => {
      if (typeof dark == 'boolean') {
        if (dark) {
          this.mapStyle = this.mapDarkStyle;
        } else {
          this.mapStyle = [];
        }
      }
    });


    this.apiService.getCapsules().subscribe(data => {
      this.storage.get('capsules').then(savedCaps => {
        //console.log('saved', savedCaps);
        if (isEqual(data, savedCaps)) {
          console.log('caps from cache');

          if(this.capsules.length == 0) {
            this.capsules = savedCaps;

            for (let cap in savedCaps) {
              //console.log(data[cap]);
              this.capsules[cap].calculatedDistance = this.locationService.getDistanceFromLatLonInKm(this.latMapCenter, this.lngMapCenter, savedCaps[cap].Latitude, savedCaps[cap].Longitude);
  
              //this.capsules.push(data[cap]);
            }
            this.capsules.sort(this.compare_Distance);
          }
        } else {
          console.log('caps from server');

          this.storage.set('capsules', data).then(data => {
            this.capsules = [];
            for (let cap in data) {
              //console.log(data[cap]);
              data[cap].calculatedDistance = this.locationService.getDistanceFromLatLonInKm(this.latMapCenter, this.lngMapCenter, data[cap].Latitude, data[cap].Longitude);
  
              this.capsules.push(data[cap]);
            }
            this.capsules.sort(this.compare_Distance);
  
            //Open marker-popup for first marker
            this.capsules[0].isOpen = true;
          });
          
        }
      });

    });




    // get User.Bookings from server
    this.getUserBookings();




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





  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
    this.hideAll();
    this.slider.slideTo(index);
  }

  onBoundsChanged(event?) {
    //console.log(event);
  }

  cardClicked(i) {
    this.hideAll();
    this.slider.slideTo(i);
    this.capsules[i].isOpen = true;
  }

  hideAll() {
    for (const item of this.capsules) {
      item.isOpen = false;
    }
  }

  onSlideChanged() {
    this.hideAll();
    this.slider.getActiveIndex().then(data => {
      this.capsules[data].isOpen = true;
    });
  }

  getDistance(lat1, lng1, lat2, lng2) {
    return this.locationService.getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2);
  }


  async animatecardtotopDone(event) {
    let animState: string = event.toState;
    if (animState == 'bottom') {

      let elem = await document.getElementById("cardTSS_top");
      elem.setAttribute("style", "visibility: hidden");
      let elem2 = await document.getElementById("slider");
      elem2.setAttribute("style", "visibility: visible");


    } else {
      //this.test = true;
      //this.timeslots = [{ content: 'pull to refresh', status: '' }];


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

        this.updateClock();
        setInterval(() => {
          this.updateClock();
        }, 1000 * 60);


      }, 100);

      // setTimeout(() => {
      //   let listelem = document.getElementById('listr');
      //   if((listelem.offsetHeight - 40) < this.timepixels) {
      //   this.tscontent.scrollByPoint(0, (this.timepixels + listelem.offsetHeight - 40), 1000);
      //   } else {
      //     this.tscontent.scrollByPoint(0, (this.timepixels - 20), 1000);
      //   }
      // }, 500);


      if (this.timeslots.length == 0) {
        this.timeslots = [{ content: 'pull to refresh', status: '' }];
      } else {
        await this.getTimeSlots(this.activeDate);
      }
    }
  }
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
    });
  }


  doRefresh(event) {
    setTimeout(() => {
      // Slowing down operation for better refresher UX
      this.getTimeSlots(this.days[this.segment.value].dateRAW);

      event.target.complete();
    }, 500);
  }



  working = false;
  getTimeSlots(date?) {

    if (this.working == true) {
      return;
    }

    this.working = true;
    /**
     * reseting relevant variables
     * IMPORTANT: this.timeslots MUST have 1 item in order to avoid triggering ngIf=timeslots in ion-slides
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


    this.apiService.getUser()
      .pipe(first())
      .subscribe(
        user => {
          this.userBookingsArray = user.bookings;
          console.log('userBookingsArray', user.bookings);


          this.findOwnBookingsForActiveCapsule();
          this.findFutureBookingsForAllCapsules();
          this.setTimeSlotsCrossCapsuleBooking();


          if (date != null) {
            this.activeDate_String = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
          }


          //formattedDateString = '2019-6-7';

          //this.findBookings();

          // get data from server
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
            this.timeslots.splice(0, 1);

            for (let val in this.userBookingsSlotsArray) {
              // Getting TimeSlotsValues -1 to be on array level which is starting at 0 and not at 1 like timeslots on server!
              this.timeslots[parseInt(this.userBookingsSlotsArray[val]) - 1].state = 'booked';
            }

            for (let val in this.crossCapsuleBookingsArray) {
              // Getting TimeSlotsValues -1 to be on array level which is starting at 0 and not at 1 like timeslots on server!
              this.timeslots[parseInt(this.crossCapsuleBookingsArray[val].slot) - 1].state = 'crossbooked';
              this.timeslots[parseInt(this.crossCapsuleBookingsArray[val].slot) - 1].capName = this.crossCapsuleBookingsArray[val].capName;
            }

            // TODO: only if segment.value 0 is equals date: today; 
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


              // TODO: Make proper async
              setTimeout(() => {
                this.blurTimeSlots();
              }, 300);

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

            this.findImpossibles();


            this.working = false;
          },
            error => {
              console.error(error);
            });
        },
        error => {
          console.log(error);
        });


  }



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

  onIonSlidePrevEnd() {
    console.log('prev ended')

    this.tscontent.scrollToTop();
    this.slides.slideTo(1, 0);
    // console.log(this.segment.value);
    // console.log(this.days[this.segment.value].dateRAW);
    this.activeDate = this.days[this.segment.value].dateRAW;
    this.getTimeSlots(this.days[this.segment.value].dateRAW);
  }

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

  onIonSlideNextEnd() {
    //console.log('next ended')

    this.tscontent.scrollToTop();
    this.slides.slideTo(1, 0);

    // console.log(this.segment.value);
    // console.log(this.days[this.segment.value].dateRAW);
    this.activeDate = this.days[this.segment.value].dateRAW;
    this.getTimeSlots(this.days[this.segment.value].dateRAW);
  }

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

  onIonSlideTransitionEnd() {
    console.log('onIonSlideTransitionEnd');
  }



  onTimeSlotClick(i) {

    console.log(this.userBookingsSlotsArray);
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




    // mark 1 slot before and 1 slot after selected to extend selection
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
    if(this.userBookingsSlotsArray.length + this.selectedCount >= this.MAX_SLOTS_PER_DAY - 1) {
      for (let a = 0; a < this.timeslots.length; a++) {
        if (this.timeslots[a].state == true) {
          this.timeslots[a].state = 'blocked';
        }
      }
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

    }

    setTimeout(() => {
      this.blurTimeSlots();
    }, 100);

  }

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



  onSegmentClick(day) {


    this.tscontent.scrollToTop();

    let date = new Date();
    date.setDate(date.getDate() + parseInt(day.value));


    this.activeDate = date;
    this.getTimeSlots(day.dateRAW);
  }

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
          title: 'Paypal payment successful',
          icon: 'https://mobappex.web.app/assets/icon/favicon.png',
          text: 'At ' + dateTime + ' you booked Capsule ' + this.capName + ' for ' + this.selectedCount * this.PRICE_PER_SLOT + '€'
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


              this.toast("booked: " + this.capName);
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
    console.log('userBookingsSlotsArray', this.userBookingsSlotsArray);
  }



  // Impossibles are time slots above or below a timeslots group reching the maximums booking limit
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
        this.timeslots[impossibles[0] - 2].state = 'impossible';
        this.timeslots[impossibles[impossibles.length - 1]].state = 'impossible';
      }

      impossibles = [];
    }
  }

  // Sort function for numbers
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

  addBookedSlot(item) {
    var index = this.userBookingsSlotsArray.findIndex(x => x == item)
    if (index === -1) {
      this.userBookingsSlotsArray.push(item);
    }
  }

  async getUserBookings() {


    await this.apiService.getUser()
      .pipe(first())
      .subscribe(
        user => {
          this.userBookingsArray = user.bookings;
          console.log('userBookingsArray @ getUserBookings()', user.bookings);
          this.findOwnBookingsForActiveCapsule();
          this.findFutureBookingsForAllCapsules();
        },
        error => {
          console.log(error);
        });
  }

  // analyzes the time slot selction and slits it into single bookings if already booked slots are inbetween this selection
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
    console.log(this.bookingsQueue);
  }


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

  async onDatePickerChanged(value) {

    this.tscontent.scrollToTop();


    console.log(value);

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
    console.log('future: ', this.futureBookings);
    this.setBookedLabel()
  }

  setBookedLabel() {
    if (this.capsules.length > 0 && this.futureBookings.length > 0) {


      // Find capsule id in futire bookings and apply booked label to capsule
      for (let book in this.futureBookings) {
        var result = this.capsules.find(obj => {
          return obj.id == this.futureBookings[book].capsuleId;
        });

        this.capsules[this.capsules.indexOf(result)].isBooked = true;
      }
    }
  }

  crossCapsuleBookingsArray = [];
  setTimeSlotsCrossCapsuleBooking() {
    this.crossCapsuleBookingsArray = [];


    let date = this.days[this.segment.value].dateRAW;

    for (let b in this.userBookingsArray) {
      let date2 = new Date(this.userBookingsArray[b].Date);

      if (date.getFullYear() + '-' + (date.getMonth() + 1)+ '-' + date.getDate() == date2.getFullYear() + '-' + (date2.getMonth() + 1)+ '-' + date2.getDate() && this.userBookingsArray[b].Capsule_id != this.capId) {
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
    console.log('crossCapsuleBookingsArray',this.crossCapsuleBookingsArray);

  }

  addBookedCapsuleSlot(item) {
    var index = this.crossCapsuleBookingsArray.findIndex(x => x.slot == item.slot)
    if (index === -1) {
      this.crossCapsuleBookingsArray.push(item);
    }
  }




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
