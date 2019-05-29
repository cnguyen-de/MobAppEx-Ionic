import { Injectable, Inject } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import {StatusBar} from '@ionic-native/status-bar/ngx';
import { NavigationBarColor } from 'ionic-plugin-navigation-bar-color';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private currentTheme = ''

  constructor(@Inject(DOCUMENT) private document: Document,
              private statusBar: StatusBar,
              private navigationBarColor: NavigationBarColor
  ) {
    this.statusBar.overlaysWebView(true);
  }

  setPrimaryColor(color: string) {
    this.setVariable('--ion-color-primary', color)
  }

  setVariable(name: string, value: string) {
    this.currentTheme = `${name}: ${value};`
    this.document.documentElement.style.setProperty(name, value)
  }

  enableDarkMode(enableDarkMode: boolean) {
    let theme = this.getLightTheme();
    if (enableDarkMode) {
      this.statusBar.backgroundColorByHexString('#141d26');
      this.navigationBarColor.backgroundColorByHexString('#141d26');
      theme = this.getDarkTheme();
    } else {
      this.statusBar.backgroundColorByHexString('#ffffff');
      this.navigationBarColor.backgroundColorByHexString('#000000');
    }
    this.document.documentElement.style.cssText = theme
  }

  getDarkTheme() {
    return `
      ${this.currentTheme}
      --background-surface-color: #243447;
      --ion-background-color: #141d26;
      --ion-item-background-color: #243447;
      --ion-toolbar-background: #243447;
      --ion-border-color: #243447;
      --ion-color-primary: #0084b4;
      --ion-text-color: #fff;
      --ion-text-color-step-400: #fff;
      --ion-text-color-step-600: #fff;
    `
  }

  getLightTheme() {
    return `
      ${this.currentTheme}
      --background-surface-color: #efefef;
      --ion-background-color: #fff;
      --ion-item-background-color: #fff;
      --ion-toolbar-background: #fff;
      --ion-border-color: #d8d8d8;
      --ion-color-primary: #08a0e9;
      --ion-text-color: #222;
      --ion-text-color-step-400: #222;
      --ion-text-color-step-600: #222;
    `
  }
}
