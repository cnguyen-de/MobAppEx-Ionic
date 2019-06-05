import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.page.html',
  styleUrls: ['./slides.page.scss'],
})
export class SlidesPage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  constructor(private storage: Storage, private router: Router, private nativePageTransitions: NativePageTransitions) {
  }

  ngOnInit() {
  }

  ionViewWillLeave() {
    let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 150,
      slowdownfactor: 2,
      androiddelay: 150,
    };
    this.nativePageTransitions.slide(options);
  }
  async finish() {
    await this.storage.set('slidesDone', true);
    let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 150,
      slowdownfactor: 2,
      androiddelay: 150,
    };
    this.nativePageTransitions.slide(options);
    this.router.navigateByUrl('/registration');
  }


}
