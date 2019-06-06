import {Component, ViewChild} from '@angular/core';
import {NativeTransitionOptions} from '@ionic-native/native-page-transitions';
import {NativePageTransitions} from '@ionic-native/native-page-transitions/ngx';
import {IonTabs} from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  @ViewChild('ionTabs') ionTabs: IonTabs;

  constructor(private nativePageTransitions: NativePageTransitions) {}

  select(nextTab: string) {
    let currentTabIndex = this.ionTabs.getSelected()[3];
    let dir: string = this.getAnimationDirection(currentTabIndex, nextTab[3]);
    if (dir != 'none') {
      let options: NativeTransitionOptions = {
        direction: dir,
        duration: 150,
        slowdownfactor: 2,
        slidePixels: 0,
        androiddelay: 0,
        fixedPixelsTop: 0,
        fixedPixelsBottom: 56
      };
      this.nativePageTransitions.slide(options);
    }
  }

  getAnimationDirection(currentTab, nextTab): string {
    switch (true) {
      case (currentTab < nextTab):
        return('left');
      case (currentTab > nextTab):
        return('right');
      case (currentTab = nextTab):
        return('none')
    }
  }

}
