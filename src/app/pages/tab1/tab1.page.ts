import { Component } from '@angular/core';
import { ApiService } from '../../_services/api/api.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  myDate = new Date();

  constructor(private apiService: ApiService){
  }

  ngOnInit(){
  }

  bookCapsule(){
    console.log("booking started");

    this.apiService.bookCapsule(1, 0, "2019-05-31T12:37:36.358Z", 0, 0, "string", 0, true, "string", 0, "2019-06-20T12:37:36.358Z").subscribe(data =>{
      console.log(data);
    })

  }

}
