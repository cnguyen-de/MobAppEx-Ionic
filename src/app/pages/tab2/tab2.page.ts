import { Component, ViewChild, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import {
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSlides
} from "@ionic/angular";
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"]
})
export class Tab2Page implements OnInit {
  @ViewChild("slider") slider: IonSlides;

  constructor(private geolocation: Geolocation) {}

  // set to false to use GPS location!
  fixedLocation: boolean = true;

  mapZoomLevel: number = 17;
  latMapCenter: number = 50.1303316;
  lngMapCenter: number = 8.69238764;
  personIcon: string = '../../../assets/images/icons/LocationPerson.svg';

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
        label: "",
        icon: "../../../assets/images/icons/SnoozeMarker.svg",
        isOpen: true,
        name: "Gebäude 1"
      },
      {
        lat: 50.13122569,
        lng: 8.69226426,
        label: "",
        icon: "../../../assets/images/icons/SnoozeMarker.svg",
        isOpen: false,
        name: "Bibliothek"
      },
      {
        lat: 50.12887008,
        lng: 8.69176537,
        label: "",
        icon: "../../../assets/images/icons/SnoozeMarker.svg",
        isOpen: false,
        name: "BCN"
      }
    ];

    /** 
     * Retrieve Current Position
     */
    if (!this.fixedLocation) {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.latMapCenter = resp.coords.latitude
        this.lngMapCenter = resp.coords.longitude
       }).catch((error) => {
         console.log('Error getting location', error);
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

  // https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    //return d;
    return Math.round(d * 1000);
  }
  
  deg2rad(deg) {
    return deg * (Math.PI/180)
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
