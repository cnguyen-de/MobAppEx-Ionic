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
  bookedArray = [];
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
    this.bookedArray = [];
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
        if (propertyName == '14' || propertyName == '16' || propertyName == '18' || propertyName == '20' || propertyName == '21') {
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



chosen = [];
onTimeSlotClick(i) {
  /*
  // mark all free slots as blocked
  for (let a = 0; a < this.timeslots.length; a++) {
    if (this.timeslots[a].state == true) {
      this.timeslots[a].state = 'blocked';
    }
  }
*/
  if (this.chosen.length != 0) {
    let same = false
    for (let a = 0; a < this.chosen.length; a++) {
      // if existed in chosen array, aka pressed a selected slot
      if (this.chosen[a] === i) {
        same = true;
        // only allow removing 1st and last slot
        if (i == this.chosen[0] || i == this.chosen[this.chosen.length - 1]) {
          this.chosen.splice(a, 1);
          this.timeslots[i].state = true;
          console.log(this.chosen)
          //calculate min max again.
          this.chosen.sort(function(a, b) { return a > b ? 1 : -1})
          let min = this.chosen[0];
          let max = this.chosen[this.chosen.length - 1];
          let min_available = this.calcMin(max);
          let max_available = this.calcMax(min);

          console.log(min, max, min_available, max_available);
          this.colorTable(min_available, max_available)
        }
        return;
      }
    }
    if (!same)  {
      this.processSelect(i)
    }
  } else {
    this.processSelect(i)
  }
  console.log(this.chosen)
}
calcMin(max) {
  //min = 0 or max - 5 (max - (max - 5) + 1 = 6)
  let min_available = Math.max(0, max - 5);
  //check for booked slot inbetween, if there is then stop after the booked slot
  for (let i = min_available; i < max; i++) {
    if (this.timeslots[i].state == 'booked') {
      min_available = i + 1;
    }
  }
  return min_available
}
calcMax(min) {
  //set max = min + 5 or 26
  let max_available = Math.min(26, min + 5);
  //check for booked slot inbetween, if there is then stop before the booked slot
  for (let i = min + 1; i < max_available; i++) {
    if (this.timeslots[i].state == 'booked') {
      max_available = i - 1;
    }
  }
  return max_available
}
processSelect(i) {
  //add chosen slot to chosen array and sort it
  this.chosen.push(i);
  this.timeslots[i].state = 'selected';
  this.chosen.sort(function(a, b) { return a > b ? 1 : -1});

  //calculate min available, max available as option to choose
  console.log(this.chosen);
  let min = this.chosen[0];
  let max = this.chosen[this.chosen.length - 1];
  let min_available = this.calcMin(max);
  let max_available = this.calcMax(min);

  console.log(min, max, min_available, max_available);
  this.colorTable(min_available, max_available)
  //handle choosing multiple slots
  if (this.chosen.length > 1) {
    //if the chosen slot is top of the current chosen slots (aka smallest)
    if (Math.abs(min - i) < Math.abs(max - i)) {
      console.log("i top adding from " + i + " to " + max);
      for (let c = i + 1; c < max; c++) {
        //check for duplicates
        let same = false;
        for (let d = 0; d < this.chosen.length; d++) {
          if (c == this.chosen[d]) {
            same = true;
          }
        }
        //mark green and add to chosen array
        if (!same) {
          this.timeslots[c].state = 'selected'
          this.chosen.push(c)
        }
      }
    } else { //if the chosen slot is bottom, same algorithm like above
      console.log("i bottom adding from " + min + " to " + i)
      for (let c = min + 1; c < i; c++) {

        let same = false;
        for (let d = 0; d < this.chosen.length; d++) {
          if (c == this.chosen[d]) {
            same = true;
          }
        }
        if (!same) {
          this.timeslots[c].state = 'selected';
          this.chosen.push(c);
        }
      }
    }
    this.chosen.sort(function(a, b) { return a > b ? 1 : -1});
  }
}
colorTable(min_available, max_available) {
  //Set all available rows from 0 to min: blocked
  for (let g = 0; g < min_available; g++) {
    if (this.timeslots[g].state == true) {
      this.timeslots[g].state = 'blocked';
    }
  }

  //Set all available rows from max to 27: blocked
  for (let g = max_available + 1; g < 27; g++) {
    if (this.timeslots[g].state == true) {
      this.timeslots[g].state = 'blocked';
    }
  }

  //Set all blocked rows inside okay range (min-max): white
  for (let g = min_available; g <= max_available; g++) {
    if (this.timeslots[g].state == 'blocked') {
      this.timeslots[g].state = true;
    }
  }

  // Set all blocked rows: white
  if ((isNaN(min_available))) {
    for (let g = 0; g < 27; g++) {
      if (this.timeslots[g].state == 'blocked') {
        this.timeslots[g].state = true;
      }
    }
  }
}

  // https://stackoverflow.com/questions/1988349/array-push-if-does-not-exist
  addItem(item) {
    var index = this.bookedArray.findIndex(x => x == item)
    if (index === -1) {
      this.bookedArray.push(item);
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
