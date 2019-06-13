import { Component, OnInit } from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { User } from '../../_services/auth/user';
import {ApiService} from '../../_services/api/api.service';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';
import {LanguageChooserModalPage} from '../../modals/language-chooser-modal/language-chooser-modal.page';
import {TranslateService} from '@ngx-translate/core';
import {ThemeService} from '../../_services/theme/theme.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  loginPressed = false;
  user : User;
  options: NativeTransitionOptions = {
    direction: 'left',
    duration: 200,
    slowdownfactor: 1,
    androiddelay: 0,
  };
  forward: boolean = false;
  darkMode: boolean;
  language: string;
  constructor(public toastController: ToastController, private http : HttpClient,
              private router : Router, private storage: Storage,
              private formBuilder: FormBuilder,
              private apiService: ApiService, private nativePageTransitions: NativePageTransitions,
              private translateService: TranslateService, private modalController: ModalController,
              private themeService: ThemeService) {

  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ionViewWillEnter() {
    this.forward = false;
    this.getDarkValue();
    this.getLanguage();
  }
  ionViewWillLeave() {
    if (!this.forward) {
      let options: NativeTransitionOptions = {
        direction: 'right',
        duration: 200,
        slowdownfactor: 1,
        androiddelay: 0,
      };
      this.nativePageTransitions.slide(options);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.loginPressed = !this.loginPressed;
    this.apiService.login(this.loginForm.value.username, this.loginForm.value.password)
        .pipe(first())
        .subscribe(
            data => {
              this.loginPressed = !this.loginPressed;
              this.loginForm.setValue({username: this.loginForm.value.username, password: ''});
              this.apiService.getUser()
                  .pipe(first())
                  .subscribe(
                      data => {
                        this.transitionTo('/tabs/tab1');
                        console.log(data)
                      },
                      error => {
                        console.log(error);
                      });
            },
            error => {
              this.loginPressed = !this.loginPressed;
              this.loginForm.setValue({username: this.loginForm.value.username, password: ''});
              console.log(error);
              if (error.status === 0 || error.status === 504) {
                this.toast("Unable to communicate with server")
              } else {
                this.toast(error)
              }
            });
  }


  //Switch Light-Dark Theme
  switchTheme() {
    this.darkMode = !this.darkMode;
    this.themeService.enableDarkMode(this.darkMode);
    this.saveToStorage('dark', this.darkMode);
  }

  //Change Language
  changeLanguage() {
    this.presentLanguageChooserModal();
  }
  async presentLanguageChooserModal() {
    const modal = await this.modalController.create({
      component: LanguageChooserModalPage,
      componentProps: {
        value: this.language
      },
      cssClass: 'language-chooser-modal'
    });

    modal.onDidDismiss().then(value => {
      if (typeof value.data == 'string') {
        this.language = value.data;
        this.translateService.use(this.language);
        this.saveToStorage('language', this.language);
        /*
        switch (value.data) {
          case 'en': this.toast("Language set to English!"); break;
          case 'de': this.toast("Sprache als Deutsch gesetzt!"); break;
        }
        */
      }
    });

    return await modal.present();
  }

  async getDarkValue() {
    this.darkMode = await this.storage.get('dark')
  }
  async getLanguage() {
    this.language = await this.storage.get('language')
  }

  transitionTo(path) {
    this.forward = true;
    this.nativePageTransitions.slide(this.options);
    this.router.navigateByUrl(path);
  }

  async saveToStorage(key: string, value: any) {
    await this.storage.set(key, value);
  }

  async toast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      cssClass: 'toast-container',
      keyboardClose: true,

    });
    toast.present();
  }

}
