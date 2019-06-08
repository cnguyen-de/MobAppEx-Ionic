import { Component, OnInit } from '@angular/core';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';

@Component({
  selector: 'app-licenses',
  templateUrl: './licenses.page.html',
  styleUrls: ['./licenses.page.scss'],
})
export class LicensesPage implements OnInit {

  constructor(private nativePageTransitions: NativePageTransitions) { }

  ngOnInit() {
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

}
