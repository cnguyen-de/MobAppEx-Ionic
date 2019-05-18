import {Component, OnInit} from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Api } from '../api/api';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  constructor(public toastController: ToastController, private http : HttpClient, private router : Router) {
  }

  ngOnInit() {
  }

  form = {
    username: "",
    email: "",
    password: "",
    passwordRepeat: ""
  };

  submit() {
    let status = "Empty field";
    if (this.form.username && this.form.email && this.form.password && this.form.passwordRepeat) {
      if (!this.form.email.includes("fra-uas.de")) {
        status = "Not fra-uas.de Domain";
      } else {
        if (!(this.form.password === this.form.passwordRepeat)) {
          status = "Password don't match";
        } else {
          status = "OK"
          //TODO encrypt password
        }
      }
    }

    if (status === "OK") {
      let requestform = {
        username: this.form.username,
        email: this.form.email,
        password: this.form.password
      }

      console.log(requestform);
      let headers = new HttpHeaders();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );

      // @ts-ignore
      let results = this.http.post("http://sass-it.de:3000/api/SnoozeUsers", requestform, headers).subscribe((res : any) => {
        this.toast("Successfully registered");
        this.router.navigateByUrl('/login');
        console.log(res)
      }, error => {
        console.log(error.error.error.message)
        this.toast(error.error.error.message)
      })
    } else {
      this.toast(status);
      this.form = {
        username: "",
        email: "",
        password: "",
        passwordRepeat: ""
      };
    }
  }

  async toast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}
