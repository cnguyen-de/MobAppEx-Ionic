import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import {delay, first, share} from 'rxjs/operators';
import { ApiService } from '../../_services/api/api.service';
import { TimeService } from '../../_services/time/time.service';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';
import isEqual from 'lodash.isequal'
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.page.html',
  styleUrls: ['./booking-history.page.scss'],
})
export class BookingHistoryPage implements OnInit {
  @ViewChild('picker') picker;

  bookings: any;
  filteredBookings: any = [];
  time: any;
  events: Date[] = [];
  datePicker: Date;
  pickerString: string;
  isFiltered: boolean = false;

  constructor(private apiService: ApiService, private timeService: TimeService,
              private nativePageTransitions: NativePageTransitions,
              private platform: Platform) { }

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

    this.picker.close(); 
  }

  addEvent(event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
    this.isFiltered = true;
    this.filteredBookings = [];

    this.datePicker = new Date(`${event.value}`);
    console.log(this.datePicker);
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
              this.bookings = this.sortData(user.bookings);
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
        return <any>new Date(b.Date) - <any>new Date(a.Date);
      });
    } catch (error) {
      // console.log("Failed");
    }
  }
}
