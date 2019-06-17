import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../_services/api/api.service';
import {first} from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { ThemeService } from 'src/app/_services/theme/theme.service';

@Component({
  selector: 'app-capsule-control',
  templateUrl: './capsule-control.page.html',
  styleUrls: ['./capsule-control.page.scss'],
})
export class CapsuleControlPage implements OnInit {

  volumeSlider: number = 0;
  lightSlider: number = 0;
  isVolumeInactive: boolean = false;
  isLightInactive: boolean = false;
  user: any;

  constructor(private storage: Storage,
              private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getCurrentUser().then(data  =>{
      this.user = data;

      this.volumeSlider = data.capsulePreference.VolumenLevel;
      this.lightSlider = data.capsulePreference.LightLevel;
    });
  }

  onChangeVolume(){
    this.apiService.setVolumePreference(this.volumeSlider).pipe(first()).subscribe(data => {
      this.user.capsulePreference.VolumenLevel = this.volumeSlider;
      this.saveToStorage('user', this.user).then(() => {
      });
    },error => {
      console.log(error);
    });
  }

  onChangeLight(){
    this.apiService.setLightPreference(this.lightSlider).pipe(first()).subscribe(data => {
      this.user.capsulePreference.LightLevel = this.lightSlider;
      this.saveToStorage('user', this.user).then(() => {
      });
    },error => {
      console.log(error);
    });
  }

  async saveToStorage(key, value) {
    await this.storage.set(key, value);
  }

}
