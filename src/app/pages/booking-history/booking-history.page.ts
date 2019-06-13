import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import {delay, first, share} from 'rxjs/operators';
import { ApiService } from '../../_services/api/api.service';
import { TimeService } from '../../_services/time/time.service';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';
import isEqual from 'lodash.isequal'
import {MatDatepickerInputEvent} from '@angular/material/datepicker';



@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.page.html',
  styleUrls: ['./booking-history.page.scss'],
})
export class BookingHistoryPage implements OnInit {

  bookings: any;
  filteredBookings: any = [];
  time: any;
  events: Date[] = [];
  datePicker: Date;
  pickerString: string;
  isFiltered: boolean = false;

  constructor(private apiService: ApiService, private timeService: TimeService,
              private nativePageTransitions: NativePageTransitions) { }

  ngOnInit() {
    this.getBookings();
  }
  ionViewWillLeave() {
    let options: NativeTransitionOptions = {
      direction: 'right',
      duration: 200,
      slowdownfactor: 1,
      androiddelay: 0,
    };
    this.nativePageTransitions.slide(options);
  }

  addEvent(type: Date, event: MatDatepickerInputEvent<Date>) {
    this.isFiltered = true;
    this.filteredBookings = [];

    this.datePicker = new Date(`${type}: ${event.value}`);
    this.datePicker.setDate(this.datePicker.getDate() + 1);
    this.pickerString = this.datePicker.toISOString();


    for(var i = 0; i < this.bookings.length; i++){
      if(this.pickerString.slice(0, 10) == this.bookings[i].Date.slice(0, 10)){
        this.filteredBookings.push(this.bookings[i]);
      }
    }
  }

  clearFilter(){
    this.filteredBookings = [];
    this.isFiltered = false;
  }

  getBookings() {
    this.apiService.getUser().pipe(first()).subscribe(
        user => {
              this.bookings = user.bookings;
            for (var i = 0; i < this.bookings.length; i++) {
              this.bookings[i].FirstTimeFrame = this.timeService.getStartTime(this.bookings[i].FirstTimeFrame);
              this.bookings[i].LastTimeFrame = this.timeService.getEndTime(this.bookings[i].LastTimeFrame);
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
