import {Component, OnInit, ViewChild} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';
import { IonSlides } from '@ionic/angular';
import {StatusBar} from '@ionic-native/status-bar/ngx';


@Component({
  selector: 'app-slides',
  templateUrl: './slides.page.html',
  styleUrls: ['./slides.page.scss'],
})
export class SlidesPage implements OnInit {
  @ViewChild('slides') slides: IonSlides;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  constructor(private storage: Storage, private router: Router, private nativePageTransitions: NativePageTransitions,
              private statusBar: StatusBar) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.statusBar.backgroundColorByHexString("#38c7ef");
  }

  ionViewWillLeave() {
    let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 200,
      slowdownfactor: 1,
      androiddelay: 0,
    };
    this.nativePageTransitions.slide(options);
    this.statusBar.backgroundColorByHexString("#ffffff");
  }

  async finish() {
    await this.storage.set('slidesDone', true);
    this.router.navigateByUrl('/registration');
  }

  next() {
    this.slides.slideTo(1, 400);
  }


}
