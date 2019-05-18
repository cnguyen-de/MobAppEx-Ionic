import {Component, Injectable, OnInit} from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Api} from '../api/api';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  constructor(public toastController: ToastController) {
  }

  ngOnInit() {
  }

  form = {
    email: "",
    password: "",
    passwordRepeat: ""
  };

  submit() {
    let status = "Empty field";
    if (this.form.email && this.form.password && this.form.passwordRepeat) {
      if (!this.form.email.includes("fra-uas.de")) {
        status = "Not fra-uas.de Domain";
      } else {
        if (!(this.form.password === this.form.passwordRepeat)) {
          status = "Password don't match";
        } else {
          status = "OK"
        }
      }
    }

    if (status === "OK") {
      console.log(this.form);
      this.toast("Signing you up");
    } else {
      this.toast(status);
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
