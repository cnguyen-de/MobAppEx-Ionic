import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, share } from 'rxjs/operators';
import { ApiService } from '../../_services/api/api.service';
import { TimeService } from '../../_services/time/time.service';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.page.html',
  styleUrls: ['./booking-history.page.scss'],
})
export class BookingHistoryPage implements OnInit {

  bookings: any;
  time: any;

  constructor(private apiService: ApiService, private timeService: TimeService) { }

  ngOnInit() {
    this.getBookings();
  }

  getBookings(){
    this.apiService.currentUser.subscribe(data =>{
      this.bookings = data.bookings;
      try {
        this.bookings.FirstTimeFrame = this.timeService.getStartTime(this.bookings.FirstTimeFrame);
        this.bookings.LastTimeFrame = this.timeService.getEndTime(this.bookings.LastTimeFrame);
        console.log(this.bookings);
      } catch (error) {
        console.log(error);
      }

    });
  }

  get timeFrames(){
    return this.timeService.getTimeRange(this.bookings.FirstTimeFrame, this.bookings.LastTimeFrame);
  }

  get sortData() {
    // this.getBookings();

    try {
      // this.time = this.timeService.getTimeRange(this.bookings.FirstTimeFrame, this.bookings.LastTimeFrame);
      return this.bookings.sort((a, b) => {
        return <any>new Date(b.Date) - <any>new Date(a.Date);
      });
    } catch (error) {
      // console.log("Failed");
    }
  }
}
