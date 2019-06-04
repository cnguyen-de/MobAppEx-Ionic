import { Component, ViewChild, OnInit } from "@angular/core";
import { IonSlides, IonSegment, IonContent, Platform} from "@ionic/angular";
import { LocationService } from '../../_services/location.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ApiService } from '../../_services/api/api.service';


@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
  animations: [
    trigger('animatecardtotop',[
       state('bottom',style({
          transform : 'translateY(0px)'
       })),
       state('top',style({
          //transform : 'translateY(-490px)',
          width: 'calc(100% - 20px)',
          height: '120px',
          position: 'absolute',
          top: 0,
          left: 0

       })),
       transition('bottom <=> top',animate('300ms ease-in'))
    ]),
    trigger('animatemapup',[
      state('bottom',style({
         transform : 'translateY(0px)'
      })),
      state('top',style({
         transform : 'translateY(-102%)',

      })),
      transition('bottom <=> top',animate('300ms ease-in'))
   ])
 ]
})
export class Tab2Page implements OnInit {
  @ViewChild("slider") slider: IonSlides;
  @ViewChild('segment') segment: IonSegment;
  @ViewChild('content') content: IonContent;
  @ViewChild('slides') slides:IonSlides;


  constructor(private locationService: LocationService,
    private apiService: ApiService,
    private platform: Platform) { }

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
    loop: true
  };

  //Animations
  cardTSS_state: string = "bottom";

  //Single Capsule Values
  capName = '';

  //Capsules
  capsules: any;

  //Timeslots
  timeslots = [];
  segmentWidth: number = 100;

  test = false;

  ngOnInit() {
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
      if(this.cardTSS_state == 'top') {
        this.animateTSS_Click();
      }
    });

    

    this.timeslots = [
      {
        content: '9:00 - 9:20', state: 'true'
      },
      {
        content: '9:20 - 9:40', state: 'selected'
      },
      {
        content: '9:40 - 10:00', state: 'false'
      },
      {
        content: '10:00 - 10:20', state: 'blocked'
      },
      {
        content: '10:20 - 10:40', state: 'inprogress'
      },
      {
        content: '10:40 - 11:00', state: 'booked'
      },
      {
        content: '11:00 - 11:20', state: 'booked'
      },
      {
        content: '11:20 - 11:40', state: 'blocked'
      },
      {
        content: '11:40 - 12:00', state: 'false'
      },
      {
        content: '12:00 - 12:20', state: 'false'
      },
      {
        content: '12:20 - 12:40', state: 'false'
      },
      {
        content: '12:40 - 13:00', state: 'false'
      },
      {
        content: '13:00 - 13:20', state: 'false'
      },
      {
        content: '13:20 - 13:40', state: 'false'
      },
      {
        content: '13:40 - 14:00', state: 'false'
      },
      {
        content: '14:00 - 14:20', state: 'false'
      },
      {
        content: '14:20 - 14:40', state: 'false'
      },
      {
        content: '14:40 - 15:00', state: 'false'
      },
      {
        content: '15:00 - 15:20', state: 'false'
      },
      {
        content: '15:20 - 15:40', state: 'false'
      },
      {
        content: '15:40 - 16:00', state: 'false'
      },
      {
        content: '16:00 - 16:20', state: 'false'
      },
      {
        content: '16:20 - 16:40', state: 'false'
      },
      {
        content: '16:40 - 17:00', state: 'false'
      },
      {
        content: '17:00 - 17:20', state: 'false'
      },
      {
        content: '17:20 - 17:40', state: 'false'
      },
      {
        content: '17:40 - 18:00', state: 'false'
      },
    ]
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
        elem.setAttribute("style", "min-width: " + (this.segmentWidth * 10).toString() + "px" );
      }, 100);
      
    }
  }

  async animateTSS_Click(item?) {

    if(item) {
      this.capName = item.Name;
    }
    let elemo = await document.getElementById("root");
    elemo.setAttribute("style", "visibility: hidden");


    let elem = await document.getElementById("cardTSS_top");
    let elem3 = await document.getElementById("slideCard");
    console.log('cardTSS_top-width: ' + elem3.offsetWidth)
    elem.setAttribute("style", "visibility: visible; width: " + elem3.offsetWidth + "px");
    let elem2 = await document.getElementById("slider");
    elem2.setAttribute("style", "visibility: hidden");

    this.cardTSS_state= this.cardTSS_state == 'top' ? 'bottom' : 'top';
  }

  getPositionClick(){
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
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
   
  }

  onButtonClick() {
    this.segment.value = "2";
    this.content.scrollToPoint(2*this.segmentWidth,0,200);
  }

  async onIonSlideDidChange(event?) {
    // let indexp = await this.slides.getPreviousIndex();
    // let indexc = await this.slides.getActiveIndex();
    // console.log(indexp + ' : ' + indexc)
    this.slides.length().then(data => {
      console.log(data);
    });
    let elem = document.getElementsByClassName("even");
    elem[0].setAttribute("style", "color:black; border: 0px solid blue;");
    elem[1].setAttribute("style", "color:black; border: 0px solid blue;");

      let elem2 = document.getElementsByClassName("odd");
      elem2[0].setAttribute("style", "color:black; border: 0px solid blue;");
      elem2[1].setAttribute("style", "color:black; border: 0px solid blue;");

    

  //   this.clickSegment(index);
    // this.timeslots = [];
    // setTimeout(() => {
    //   this.timeslots = this.timeslots2;

    // }, 1000);
    
  }


  async onIonSlidePrevStart() {
    //console.log('prev start')
    let index = await +this.segment.value;
    if(index === 0) {
      index = 10;
    }
    this.segment.value = (index - 1).toString();
    this.content.scrollToPoint((index-1)*this.segmentWidth,0,200);
  }

  onIonSlidePrevEnd() {
    //console.log('prev ended')
  }

  async onIonSlideNextStart() {
    //console.log('next start')
    let index = await +this.segment.value;
    if(index === 9) {
      index = -1;
    }
    this.segment.value = (index + 1).toString();
    this.content.scrollToPoint((index+1)*this.segmentWidth,0,200);
  }

  onIonSlideNextEnd() {
    //console.log('next ended')
  }

  async onIonSlideTouchStart() {
    //let indexp = await this.slides.getPreviousIndex();
    let indexc = await this.slides.getActiveIndex();
    
    //console.log(indexp + ' : ' + indexc)

    if(indexc === 0 || indexc ===2) {
      let elem = document.getElementsByClassName("odd");
      elem[0].setAttribute("style", "color:red; border: 0px solid blue;");
      elem[1].setAttribute("style", "color:green; border: 0px solid blue;");
      let elem2 = document.getElementsByClassName("even");
      elem2[0].setAttribute("style", "color:black; border: 0px solid blue;");
      elem2[1].setAttribute("style", "color:black; border: 0px solid blue;");
    } else {
      let elem = document.getElementsByClassName("even");
      elem[0].setAttribute("style", "color:red; border: 0px solid blue;");
      elem[1].setAttribute("style", "color:green; border: 0px solid blue;");
      let elem2 = document.getElementsByClassName("odd");
      elem2[0].setAttribute("style", "color:black; border: 0px solid blue;");
      elem2[1].setAttribute("style", "color:black; border: 0px solid blue;");
    }
    
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
