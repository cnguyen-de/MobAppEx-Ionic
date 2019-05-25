import { Injectable } from  '@angular/core';
import { HttpClient} from  '@angular/common/http';
import {  map } from  'rxjs/operators';
import { Observable, BehaviorSubject } from  'rxjs';

import { Storage } from  '@ionic/storage';
import { User } from  './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private httpClient: HttpClient, private storage: Storage) {
    // @ts-ignore
    this.currentUserSubject = new BehaviorSubject<User>(this.getUser());
    this.currentUser = this.currentUserSubject.asObservable();
  }


  server = this.storage.get('server').then((serverIP) => {
    this.server = serverIP;
  })

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
          this.saveToStorage('session', res)
        })
    );
  }

  async saveToStorage(key: string, value: any) {
    await this.storage.set(key, value);
  }

}
