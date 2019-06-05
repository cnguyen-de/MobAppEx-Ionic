import { Component, OnInit } from '@angular/core';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';

@Component({
  selector: 'app-this-app',
  templateUrl: './this-app.page.html',
  styleUrls: ['./this-app.page.scss'],
})
export class ThisAppPage implements OnInit {

  constructor(private nativePageTransitions: NativePageTransitions) { }

  ngOnInit() {
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
}
