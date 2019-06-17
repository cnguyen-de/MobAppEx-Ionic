import { Component, OnInit } from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {ApiService} from '../../_services/api/api.service';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';
import {LanguageChooserModalPage} from '../../modals/language-chooser-modal/language-chooser-modal.page';
import {TranslateService} from '@ngx-translate/core';
import {ThemeService} from '../../_services/theme/theme.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  registrationForm: FormGroup;
  buttonPressed = false;
  options: NativeTransitionOptions = {
    direction: 'left',
    duration: 200,
    slowdownfactor: 1,
    androiddelay: 0,
  };
  forward: boolean = false;
  darkMode: boolean;
  language: string;
  constructor(public toastController: ToastController, private http: HttpClient,
              private router : Router, public storage : Storage,
              private authenticationService: ApiService, private formBuilder: FormBuilder,
              private nativePageTransitions: NativePageTransitions,
              private translateService: TranslateService, private modalController: ModalController,
              private themeService: ThemeService)
  { }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validator: this.checkPasswords('password', 'repeatPassword')
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

  checkPasswords(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      return;
    }
    this.buttonPressed = !this.buttonPressed;
    this.authenticationService.register(this.registrationForm.value.username,
                                        this.registrationForm.value.email,
                                        this.registrationForm.value.password)
        .pipe(first())
        .subscribe(
            data => {
              this.toast('Successfully registered');
              this.transitionTo('/login');
              this.buttonPressed = !this.buttonPressed;
            },
            error => {
              this.buttonPressed = !this.buttonPressed;
              console.log(error);
              if (error.status === 0 || error.status === 504) {
                this.toast("Unable to communicate with server")
              } else if (error) {
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
    //this.presentLanguageChooserModal();
    let languages = ['en', 'de'];
    for (let i = 0; i < languages.length; i++) {
      if (this.language == languages[i]) {
        if (i < this.language.length - 1) {
          this.language = languages[i + 1];
          this.saveToStorage('language', this.language);
          break;
        } else if (i == this.language.length - 1) {
          this.language = languages[0];
          this.saveToStorage('language', this.language);
          break;
        }
      }
    }
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
      keyboardClose: true
    });
    toast.present();
  }
}
