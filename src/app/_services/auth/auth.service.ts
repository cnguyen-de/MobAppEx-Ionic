import { Injectable } from  '@angular/core';
import { HttpClient} from  '@angular/common/http';
import {  map } from  'rxjs/operators';
import { Observable, BehaviorSubject } from  'rxjs';

import { Storage } from  '@ionic/storage';
import { User } from './user';
import {CookieService} from 'ngx-cookie-service';
import {ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private httpClient: HttpClient, private storage: Storage,
              private cookieService: CookieService, private toastController: ToastController) {
    // @ts-ignore
    this.currentUserSubject = new BehaviorSubject<User>(this.getUser());
    this.currentUser = this.currentUserSubject.asObservable();
  }


  server = this.storage.get('server').then((serverIP) => {
    this.server = serverIP;
  });

  async getUser() {
    return await this.storage.get('currentUser')
  }

  public get currentUserValue() : User {
    return this.currentUserSubject.value;
  }

  register(username: string, email: string, password: string) {
    return this.httpClient.post(`${this.server}/SnoozeUsers`, {username, email, password}).pipe(
        map(async (res) => {
          console.log(res)
        })
    );
  }

  login(username: string, password: string) {
    return this.httpClient.post(`${this.server}/SnoozeUsers/login`, {username, password}).pipe(
        map( (res) => {
          console.log(res);
          this.saveToStorage('session', res)
          // @ts-ignore
          this.saveToStorage('roundcube_sessid', res.id)
          this.setCookie(res.id)
          this.toast('Authenticated, loading user ' + res.userId)
        })
    );
  }

  async saveToStorage(key: string, value: any) {
    await this.storage.set(key, value);
  }
  setCookie(sessId) {
    this.cookieService.set('roundcube_sessid', sessId)
    console.log(this.cookieService.get('roundcube_sessid'))
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

}
