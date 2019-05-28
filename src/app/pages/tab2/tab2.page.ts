import { Component, ViewChild, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import {
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSlides
} from "@ionic/angular";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"]
})
export class Tab2Page implements OnInit {
  @ViewChild("slider") slider: IonSlides;

  constructor() {}

  mapZoomLevel: number = 17;
  latMapCenter: number = 50.1303316;
  lngMapCenter: number = 8.69238764;
  personIcon: string = '../../../assets/images/icons/LocationPerson.svg';

  capsules = [];

  slidesConfig = {
    spaceBetween: 1,
    centeredSlides: true,
    slidesPerView: 1.6
  };

  ngOnInit() {
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
