import { Component, OnInit } from '@angular/core';
import { Storage} from '@ionic/storage';
import { Router} from '@angular/router';

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

  constructor(private storage: Storage, private router: Router) { }

  ngOnInit() {
  }

    async finish() {
        await this.storage.set('slidesDone', true);
        this.router.navigateByUrl('/registration');
    }
}
