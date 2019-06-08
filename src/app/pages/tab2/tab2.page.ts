import { map } from 'rxjs/operators';
import { Component, ViewChild, OnInit } from "@angular/core";
import { IonSlides, IonSegment, IonContent, Platform } from "@ionic/angular";
import { LocationService } from '../../_services/location.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ApiService } from '../../_services/api/api.service';
import { TimeService } from '../../_services/time/time.service';
import { AgmMap, AgmCoreModule } from '@agm/core';


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
  ]
})
export class Tab2Page implements OnInit {
  @ViewChild("slider") slider: IonSlides;
  @ViewChild('segment') segment: IonSegment;
  @ViewChild('content') content: IonContent;
  @ViewChild('slides') slides: IonSlides;


  constructor(private locationService: LocationService,
    private apiService: ApiService,
    private platform: Platform,
    private timeService: TimeService) { }

  // set to false to use GPS location!
  fixedLocation: boolean = true;

  //Map
  mapZoomLevel: number = 17;
  latMapCenter: number = 50.1303316;
  lngMapCenter: number = 8.69238764;
  personIcon: string = '../../../assets/images/icons/LocationPerson.svg';
  capsuleIcon: string = '../../../assets/images/icons/SnoozeMarker.svg';
  spinBtnPositionPressed = false;


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
  capId = '';

  //Capsules
  capsules: any;

  //Day Segments
  days = [];
  daysRange: number = 30;

  //Timeslots
  timeslots = [];
  timeslots2 = [];
  segmentWidth: number = 100;

  MAX_SLOTS_PER_BOOKING = 6;
  //bookedArray = [];
  bookedArray_Up = [];
  bookedArray_Down = [];
  bookedArray_AfterNext_Up = [];
  bookedArray_AfterNext_Down = [];

  selectedCount = 0;
  firstSelected = -1;
  lastSelected = -1;

  test = false;

  ngOnInit() {


    //Create 30 days for days-segment
    for (let i = 0; i < this.daysRange; i++) {
      var date = new Date();
      date.setDate(date.getDate() + i);

      let formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit'
      }).format(date);

      if (i == 0) {
        formattedDate = 'Today';
      } else if (i == 1) {
        formattedDate = 'Tomorrow';
      }
      let day = {
        date: formattedDate,
        value: i.toString()
      }
      this.days.push(day);
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

    this.apiService.getCapsules().subscribe(data => {
      this.capsules = data;

      //Open marker-popup for first marker
      this.capsules[0].isOpen = true;
    });

    /** 
     * Retrieve Current Position
     */
    if (!this.fixedLocation) {
      this.locationService.getCurrentPosition().then(data => {
        console.log('Result getting location in Component', data);
        this.latMapCenter = data.coords.latitude;
        this.lngMapCenter = data.coords.longitude;
      });
    }

    this.platform.backButton.subscribe(() => {
      if (this.cardTSS_state == 'top') {
        this.animateTSS_Click();
      }
    });
  }



  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
    this.hideAll();
    this.slider.slideTo(index);
  }

  onBoundsChanged(event?) {
    console.log(event);
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

      setTimeout(() => {
        let elem2 = document.getElementById("root");
        elem2.setAttribute("style", "visibility: visible");

        let elem: HTMLElement = document.getElementById('segmt');
        elem.setAttribute("style", "min-width: " + (this.segmentWidth * this.daysRange).toString() + "px");
      }, 100);

      await this.getTimeSlots();
      // this.apiService.getCapsuleAvailability(1, '2019-06-02').subscribe(data => {
      //   // https://stackoverflow.com/questions/85992/how-do-i-enumerate-the-properties-of-a-javascript-object
      //   for (var propertyName in data) {
      //     // propertyName is what you want
      //     // you can get the value like this: myObject[propertyName]
      //     let tmp = {
      //       content: this.timeService.getTimeRange(+(propertyName), +(propertyName)),
      //       state: data[propertyName]
      //     }
      //     if(propertyName == '7' || propertyName == '10') {
      //       tmp.state = false;
      //     }
      //     this.timeslots.push(tmp);
      //   }
      // });

    }
  }

  async animateTSS_Click(item?) {

    if (item) {
      this.capName = item.Name;
      this.capId = item.id;
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

  }

  getPositionClick() {
    this.spinBtnPositionPressed = true;
    this.locationService.getCurrentPosition().then(data => {
      console.log('Result getting location in Component', data);
      this.latMapCenter = data.coords.latitude;
      this.lngMapCenter = data.coords.longitude;
      this.spinBtnPositionPressed = false;
    });
  }







  doRefresh(event) {
    setTimeout(() => {
      // Slowing down operation for better refresher UX
      this.getTimeSlots();

      event.target.complete();
    }, 500);
  }

  async getTimeSlots() {
    /**
     * reseting relevant variables
     * IMPORTANT: this.timeslots MUST have 1 item in order to avoid triggering ngIf=timeslots in ion-slides
     * @author Dave
     */
    this.timeslots = [{ content: 'pull to refresh', status: '' }];
    this.firstSelected = -1;
    this.lastSelected = -1;
    //this.bookedArray = [];
    this.bookedArray_Up = [];
    this.bookedArray_Down = [];
    this.bookedArray_AfterNext_Up = [];
    this.bookedArray_AfterNext_Down = [];
    this.selectedCount = 0;

    // get data from server
    await this.apiService.getCapsuleAvailability(1, '2019-06-06').subscribe(data => {
      // data from server not formatted properly; using workaround:
      // https://stackoverflow.com/questions/85992/how-do-i-enumerate-the-properties-of-a-javascript-object
      for (var propertyName in data) {
        // propertyName is what you want
        // you can get the value like this: myObject[propertyName]
        let tmp = {
          content: this.timeService.getTimeRange(+(propertyName), +(propertyName)),
          state: data[propertyName]
        }
       
        if (propertyName == '1' ||
        propertyName == '4' || 
        propertyName == '5' || 
        propertyName == '7' || 
        propertyName == '8' || 
        propertyName == '10' || 
        propertyName == '14' || 
        propertyName == '16' || 
        propertyName == '17' || 
        propertyName == '18' || 
        propertyName == '27' || 

        // propertyName == '9' || 
        // propertyName == '11' || 
        // propertyName == '12' || 
        // propertyName == '13' || 
        // propertyName == '14' || 
        // propertyName == '15' || 
        // propertyName == '16' || 
        propertyName == '19') {
          tmp.state = 'booked';
        }
        this.timeslots.push(tmp);
      }
      this.timeslots.splice(0, 1);
    },
      error => {
        console.error(error);
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
        index = this.daysRange;
      }
      this.segment.value = (index - 1).toString();
      this.content.scrollToPoint((index - 1) * this.segmentWidth, 0, 200);
      this.slidingCount = 0;
    }

  }

  onIonSlidePrevEnd() {
    console.log('prev ended')
    this.slides.slideTo(1, 0);
  }

  async onIonSlideNextStart() {
    console.log('next start')
    this.slidingCount++;
    if (this.slidingCount > 1) {

      let index = await +this.segment.value;
      if (index === this.daysRange - 1) {
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
    console.log('next ended')
    this.slides.slideTo(1, 0);
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







    // handle booked slots upwards
    if (this.firstSelected > 0 && this.timeslots[this.firstSelected - 1].state == 'booked') {
      
      let c = 1;
      while (this.firstSelected - c >= 0 && this.timeslots[this.firstSelected - c].state == 'booked') {
        
        this.addItem('booked_up', this.firstSelected - c);
        c++;
        console.log('first upwards bookeds: '+  this.bookedArray_Up);
      }

      if (this.firstSelected > 0 && this.firstSelected - c >= 0 &&
        this.selectedCount + this.bookedArray_Down.length + this.bookedArray_Up.length &&
        this.timeslots[this.firstSelected - c].state == 'blocked') {
        this.timeslots[this.firstSelected - c].state = true;
      }

      if (this.firstSelected > 1 &&
        this.timeslots[this.firstSelected - c].state == true && 
        this.timeslots[this.firstSelected - c + 1].state == 'booked') {
         
         let c2 = c;
           while (this.firstSelected - c2 < this.timeslots.length - 2 && 
            this.timeslots[this.firstSelected - (c2 + 1)].state == 'booked') {
             //console.log(c2 + ': ' + this.timeslots[this.firstSelected - c2].state);
             this.addItem('booked_afternext_up', this.firstSelected - (c2 + 1));
             c2++;
           }
      console.log('first upwards c: '+  c);

      console.log('first upwards c2: '+  c2);
      console.log('first selected - c: '+  (this.firstSelected - c).toString());
      console.log('selected + booked: '+ (this.selectedCount + this.bookedArray_Up.length));

           // größer gleich 5 weil das das ddarauffolgende auch booked ist und somit das limit erreicht
         if ((this.selectedCount + this.bookedArray_Up.length + this.bookedArray_Down.length + this.bookedArray_AfterNext_Up.length) >= 5) {
           if(this.timeslots[this.firstSelected - c].state == true) {
            this.timeslots[this.firstSelected - c].state = 'blocked';
           }
         } 
       }
    }

// - - - - - - - - - - - - - - - - - - - - - - - - - -


    // handle booked slots downwards
    if (this.lastSelected < this.timeslots.length - 1 && this.timeslots[this.lastSelected + 1].state == 'booked') {
      console.log('triggered: next is booked');

      let c = 1;
      while (this.lastSelected + c < this.timeslots.length && this.timeslots[this.lastSelected + c].state == 'booked') {
        this.addItem('booked_down', this.lastSelected + c);
        c++;
      }
      console.log('booked down c: ' + c);
      if (this.lastSelected < this.timeslots.length - 1 && this.lastSelected + c < this.timeslots.length &&
        this.selectedCount + this.bookedArray_Down.length + this.bookedArray_Up.length < this.MAX_SLOTS_PER_BOOKING &&
        this.timeslots[this.lastSelected + c].state == 'blocked') {
        this.timeslots[this.lastSelected + c].state = true;
      }

     
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
           console.log('booked down c2: ' + c2);
           console.log('first downwards c: '+  c);

      console.log('first downwards c2: '+  c2);
      console.log('first selected + c: '+  (this.lastSelected + c).toString());
      console.log('selected: '+ (this.selectedCount));
      console.log('bookedDown: '+ (this.bookedArray_Down.length));
      console.log('bookedDownAfter: '+ (this.bookedArray_AfterNext_Down.length));


      console.log('selected + booked: '+ (this.selectedCount + this.bookedArray_Down.length + this.bookedArray_AfterNext_Down.length));

           // größer gleich 5 weil das das ddarauffolgende auch booked ist und somit das limit erreicht
         if ((this.selectedCount + this.bookedArray_Up.length + this.bookedArray_Down.length + this.bookedArray_AfterNext_Down.length) >= 5) {
           if(this.timeslots[this.lastSelected + c].state == true) {
            this.timeslots[this.lastSelected + c].state = 'blocked';
           }
         } 
         
        //  else {
        //    if(this.timeslots[this.lastSelected + c2+1].state == 'blocked')
        //   this.timeslots[this.lastSelected + c2+1].state = true;
        //  }

       }
      //  console.log('selected count: ' + this.selectedCount);
      //  console.log('booked count: ' + this.bookedArray.length);
      //  if (this.lastSelected < this.timeslots.length - 1 && this.lastSelected + c < this.timeslots.length &&
      //   this.selectedCount < this.MAX_SLOTS_PER_BOOKING - this.bookedArray.length &&
      //   this.timeslots[this.lastSelected + c].state == 'blocked') {
      //     console.log('triggered: FIRED');

      //   this.timeslots[this.lastSelected + c].state = true;
      // }

    }


    // mark 1 slot before and 1 slot after selected to extend selection
    if ((this.firstSelected > 0 &&
      this.selectedCount < this.MAX_SLOTS_PER_BOOKING - (this.bookedArray_Up.length + this.bookedArray_Down.length) &&
      this.timeslots[this.firstSelected - 1].state == 'blocked')) {
      this.timeslots[this.firstSelected - 1].state = true;
    }
    if (this.lastSelected < this.timeslots.length - 1 &&
      this.selectedCount < this.MAX_SLOTS_PER_BOOKING - (this.bookedArray_Up.length + this.bookedArray_Down.length) &&
      this.timeslots[this.lastSelected + 1].state == 'blocked') {
      this.timeslots[this.lastSelected + 1].state = true;
    }


    //AFTER NEXT UP: selected -> free -> booked
    if (this.firstSelected > 0 && this.timeslots[this.firstSelected - 1].state == true) {
      console.log('AFTER NEXT UP');
      let c = 1;
      if (this.firstSelected > 1 &&
        this.timeslots[this.firstSelected - c].state == true && 
        this.timeslots[this.firstSelected - c + 1].state == 'booked') {
         
         let c2 = c;
           while (this.firstSelected - c2 < this.timeslots.length - 2 && 
            this.timeslots[this.firstSelected - c2 - 1].state == 'booked') {
             //console.log(c2 + ': ' + this.timeslots[this.firstSelected - c2].state);
             this.addItem('booked_afternext_up', this.firstSelected - c2 - 1);
             c2++;
           }

         if ((this.selectedCount + this.bookedArray_Up.length + this.bookedArray_AfterNext_Up.length) >= 5) {
           if(this.timeslots[this.firstSelected - c].state == true) {
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
           console.log('booked down c2: ' + c2);
         if ((this.selectedCount + this.bookedArray_Down.length + this.bookedArray_AfterNext_Down.length) >= 5) {
           if(this.timeslots[this.lastSelected + c].state == true) {
            this.timeslots[this.lastSelected + c].state = 'blocked';
           }
         } 
       }
    }

      
    //check if AFTER NEXT booked slot may result in a 7+ slot booking if not blocked properly
    // if (this.firstSelected > 1 &&
    //   this.timeslots[this.firstSelected - 2].state == 'booked' && 
    //   this.selectedCount + this.bookedArray.length == 5 &&
    //   this.timeslots[this.firstSelected - 1].state == true) {
    //   this.timeslots[this.firstSelected - 1].state = 'blocked';
    // } 
    
    
    // if (this.lastSelected < this.timeslots.length - 2 &&
    //  this.timeslots[this.lastSelected + 1].state == 'booked' && 
    //  this.timeslots[this.lastSelected + 1].state == true) {

      
    //   let c = 2;
    //     while (this.lastSelected + c < this.timeslots.length && this.timeslots[this.lastSelected + c].state == 'booked') {
    //       console.log(c + ': ' + this.timeslots[this.lastSelected + c].state);
    //       this.addItem(this.lastSelected + c);
    //       c++;
    //       console.log(this.bookedArray);
    //     }

    //   if (this.selectedCount + this.bookedArray.length > 5 && this.timeslots[this.lastSelected + 1].state == true) {
    //     this.timeslots[this.lastSelected + 1].state = 'blocked';
    //     console.log('triggered');
    //   }
    // }

    // mark all blocked as free if no slot is selected
    if (this.selectedCount == 0) {
      for (let a = 0; a < this.timeslots.length; a++) {
        if (this.timeslots[a].state == 'blocked') {
          this.timeslots[a].state = true;
        }
      }
      this.firstSelected = -1;
      this.lastSelected = -1;
      //this.bookedArray = [];
      this.bookedArray_Up = [];
      this.bookedArray_Down = [];
      this.bookedArray_AfterNext_Up = [];
      this.bookedArray_AfterNext_Down = [];

    }

  }

  // https://stackoverflow.com/questions/1988349/array-push-if-does-not-exist
  addItem(array, item) {
    if(array == 'booked_afternext_up') {
      var index = this.bookedArray_AfterNext_Up.findIndex(x => x == item)
      if (index === -1) {
        this.bookedArray_AfterNext_Up.push(item);
      }
    } else if (array == 'booked_afternext_down') {
      var index = this.bookedArray_AfterNext_Down.findIndex(x => x == item)
      if (index === -1) {
        this.bookedArray_AfterNext_Down.push(item);
      }
    } else if (array == 'booked_up') {
      var index = this.bookedArray_Up.findIndex(x => x == item)
      if (index === -1) {
        this.bookedArray_Up.push(item);
      }
    } else if (array == 'booked_down') {
      var index = this.bookedArray_Down.findIndex(x => x == item)
      if (index === -1) {
        this.bookedArray_Down.push(item);
      }
    }



    
    // else {
    //   console.log("object already exists")
    // }
  }





  // results: Observable<any>;
  // searchTerm: string = '';
  // @ViewChild('slides') slides : IonSlides;
  // @ViewChild('segment') segment: IonSegment;
  // @ViewChild('searchbar') searchbar: IonSearchbar;

  // //Search bar controller
  // onSearchChange($event: any) {
  //   console.log(this.searchTerm)
  // }

  // //Fab controller
  // onFabSelect() {
  //   console.log("Fab Pressed")
  //   this.searchbar.setFocus();
  // }

  // //Segments-Slides controller
  // onSegmentChange($event: any) {
  //   this.slides.slideTo($event.detail.value);
  //   //console.log(this.segment.value);
  // }

  // async onSlideDidChange($event: any) {
  //   let index = await this.slides.getActiveIndex();
  //   //console.log(index)
  //   this.clickSegment(index);
  // }

  // clickSegment(index: number) {
  //   // @ts-ignore
  //   this.segment.value = index;
  // }
}
