import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, share } from 'rxjs/operators';
import { ApiService } from '../../_services/api/api.service';
import { TimeService } from '../../_services/time/time.service';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.page.html',
  styleUrls: ['./booking-history.page.scss'],
})
export class BookingHistoryPage implements OnInit {

  bookings: any;
  time: any;

  constructor(private apiService: ApiService, private timeService: TimeService,
              private nativePageTransitions: NativePageTransitions) { }

  ngOnInit() {
    this.getBookings();
  }
  ionViewWillLeave() {
    let options: NativeTransitionOptions = {
      direction: 'right',
      duration: 150,
      slowdownfactor: 2,
      androiddelay: 150,
    };
    this.nativePageTransitions.slide(options);
  }
  getBookings(){
    this.apiService.currentUser.subscribe(data =>{
      try {
        data.bookings = this.sortData(data.bookings);
        // this.bookings = data.bookings.slice().reverse();
        this.bookings = data.bookings;

        for(var i = 0; this.bookings.length; i++){
          this.bookings[i].FirstTimeFrame = this.timeService.getStartTime(this.bookings[i].FirstTimeFrame);
          this.bookings[i].LastTimeFrame = this.timeService.getEndTime(this.bookings[i].LastTimeFrame);
        }
      } catch (error) {
        // console.log(error);
      }

    });
  }

  get timeFrames(){
    return this.timeService.getTimeRange(this.bookings.FirstTimeFrame, this.bookings.LastTimeFrame);
  }

  sortData(data) {
    try {
      return data.sort((a, b) => {
        return <any>new Date(b.PayedDate) - <any>new Date(a.PayedDate);
      });
    } catch (error) {
      // console.log("Failed");
    }
  }
}
