import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { User } from '../../_services/auth/user';
import {ApiService} from '../../_services/api/api.service';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';


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
    duration: 150,
    slowdownfactor: 2,
    androiddelay: 150,
  };
  forward: boolean = false;
  constructor(public toastController: ToastController, private http : HttpClient,
              private router : Router, private storage: Storage,
              private formBuilder: FormBuilder,
              private apiService: ApiService, private nativePageTransitions: NativePageTransitions) {

  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
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
