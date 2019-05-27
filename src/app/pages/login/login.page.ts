import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../_services/auth/auth.service';
import { first } from 'rxjs/operators';
import { User } from '../../_services/auth/user';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  loginPressed = false;
  user : User;

  constructor(public toastController: ToastController, private http : HttpClient,
              private router : Router, private storage: Storage,
              private authenticationService : AuthService, private formBuilder: FormBuilder,
              private cookieService: CookieService) {

  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.loginPressed = !this.loginPressed;
    this.authenticationService.login(this.loginForm.value.username, this.loginForm.value.password)
        .pipe(first())
        .subscribe(
            data => {
              this.storage.get('session').then((session) => {
                this.toast('Authenticated, loading user ' + session.userId)
                this.setCookie(session.id)
              });
              this.router.navigateByUrl('/tabs/tab1');
              this.loginPressed = !this.loginPressed;
            },
            error => {
              this.loginPressed = !this.loginPressed;
              console.log(error);
              if (error.status === 0 || error.status === 504) {
                this.toast("Unable to communicate with server")
              } else if (error.error.error.message) {
                this.toast(error.error.error.message)
              }
            });
  }

  async saveToStorage(key: string, value: any) {
    await this.storage.set(key, value);
  }

  async toast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: "dark"
    });
    toast.present();
  }
  setCookie(sessId) {
    this.cookieService.set('roundcube_sessid', sessId)
    console.log(this.cookieService.get('roundcube_sessid'))
  }

}
