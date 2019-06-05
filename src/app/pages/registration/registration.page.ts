import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {ApiService} from '../../_services/api/api.service';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';


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
    duration: 150,
    slowdownfactor: 2,
    androiddelay: 150,
  };
  forward: boolean = false;

  constructor(public toastController: ToastController, private http : HttpClient,
              private router : Router, public storage : Storage,
              private authenticationService: ApiService, private formBuilder: FormBuilder,
              private nativePageTransitions: NativePageTransitions) { }

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

  ionViewDidEnter() {
    this.forward = false;
  }
  ionViewWillLeave() {
    if (!this.forward) {
      let options: NativeTransitionOptions = {
        direction: 'right',
        duration: 150,
        slowdownfactor: 2,
        androiddelay: 150,
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

  transitionTo(path) {
    this.forward = true;
    this.nativePageTransitions.slide(this.options);
    this.router.navigateByUrl(path);
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
