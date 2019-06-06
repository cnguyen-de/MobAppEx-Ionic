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
      duration: 200,
      slowdownfactor: 4,
      androiddelay: 0,
    };
    this.nativePageTransitions.slide(options);
  }

  async finish() {
    await this.storage.set('slidesDone', true);
    this.router.navigateByUrl('/registration');
  }


}
