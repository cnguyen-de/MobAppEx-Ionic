import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(public toastController: ToastController) { }

  ngOnInit() {
  }

  form = {
    email: "",
    password: ""
  };

  submit() {
    let status = "Empty field";
    if (this.form.email && this.form.password) {
      if (!this.form.email.includes("fra-uas.de")) {
        status = "Invalid Email";
      } else {
       //encrypt password
      }
    }

    if (status === "OK") {
      console.log(this.form);
      this.toast("Signing in");
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
