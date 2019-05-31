import { SlidesPage } from './../slides/slides.page';
import { Component, ViewChild, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import {
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSlides,
  ModalController,
  PopoverController
} from "@ionic/angular";
import { LocationService } from '../../_services/location.service'

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"]
})
export class Tab2Page implements OnInit {
  @ViewChild("slider") slider: IonSlides;

  constructor(private locationService: LocationService,
    public modalController: ModalController,
    public popoverController: PopoverController) { }

  // set to false to use GPS location!
  fixedLocation: boolean = true;

  mapZoomLevel: number = 17;
  latMapCenter: number = 50.1303316;
  lngMapCenter: number = 8.69238764;
  personIcon: string = '../../../assets/images/icons/LocationPerson.svg';
  capsuleIcon: string = '../../../assets/images/icons/SnoozeMarker.svg';
  capsules = [];

  slidesConfig = {
    spaceBetween: 10,
    centeredSlides: true,
    slidesPerView: 1.5
  };

  ngOnInit() {
    // Demo Data
    this.capsules = [
      {
        lat: 50.13017685,
        lng: 8.69303674,
        isOpen: true,
        name: "Gebäude 1"
      },
      {
        lat: 50.13122569,
        lng: 8.69226426,
        isOpen: false,
        name: "Bibliothek"
      },
      {
        lat: 50.12887008,
        lng: 8.69176537,
        isOpen: false,
        name: "BCN"
      }
    ];

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

  
  async presentModal() {
    const modal = await this.modalController.create({
      component: SlidesPage,
      componentProps: { value: 123 }
    });
    return await modal.present();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: SlidesPage,
      event: ev,
      translucent: true
    });
    
    return await popover.present();
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
