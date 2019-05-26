import {Component, ViewChild} from '@angular/core';
import { Observable } from 'rxjs';
import {IonSegment, IonSegmentButton, IonSlides} from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  results: Observable<any>;
  searchTerm: string = '';
  @ViewChild('slides') slides : IonSlides;
  @ViewChild('segment') segment: IonSegment;

  searchChanged($event: any) {
    console.log(this.searchTerm)
  }

  segmentChanged($event: any) {
    this.slides.slideTo($event.detail.value);
    //console.log(this.segment.value);
  }

  async onSlideDidChange($event: any) {
    let index = await this.slides.getActiveIndex();
    //console.log(index)
    this.clickSegment(index);
  }

  clickSegment(index: number) {
    // @ts-ignore
    this.segment.value = index;
  }
}
