import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(public toastController: ToastController, private http : HttpClient, private router : Router, private storage: Storage) { }

  ngOnInit() {
  }

  form = {
    username: "",
    password: ""
  };

  submit() {
    let status = "Empty field";
    if (this.form.username && this.form.password) {
       //TODO encrypt password
        status = "OK"
    }

    if (status === "OK") {
      console.log(this.form);
      let headers = new HttpHeaders();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );
      // @ts-ignore
      let results = this.http.post("http://sass-it.de:3000/api/SnoozeUsers/login", this.form, headers).subscribe((res : any) => {
        console.log(res)
        if (res.id) {
          let session = {
            id: res.id,
            userId: res.userId
          }
          this.saveToStorage('session', session)

          this.router.navigateByUrl('/tabs/tab1')
        }
      }, error => {
        console.log(error)
        this.toast(error.error.error.message)
      })
    } else {
      this.toast(status);
    }
  }

  async saveToStorage(key: string, value: any) {
    await this.storage.set(key, value);
  }

  async toast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}
