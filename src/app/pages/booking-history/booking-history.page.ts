import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../_services/api/api.service';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.page.html',
  styleUrls: ['./booking-history.page.scss'],
})
export class BookingHistoryPage implements OnInit {

  bookings: any;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getBookings();
  }

  getBookings(){
    this.apiService.currentUser.subscribe(data =>{
      console.log(data.bookings);
      this.bookings = data.bookings;
    });
  }
}
