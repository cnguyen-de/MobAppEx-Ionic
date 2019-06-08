import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../auth/user';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  token: string;
  server: string = "https://platania.info:3000/api";
  user: User;

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private httpClient: HttpClient, private storage: Storage) {
    // @ts-ignore
    this.currentUserSubject = new BehaviorSubject<User>(this.getUser());
    this.currentUser = this.currentUserSubject.asObservable();

    this.storage.get('access_token').then(token => {
      if (typeof token == 'string') {
        this.token = token;
      }
    });
  }

  //API METHODS

  register(username: string, email: string, password: string) {
    return this.httpClient.post(`${this.server}/SnoozeUsers`, {username, email, password}).pipe(
        map(async (res) => {
          console.log(res);
          return res;
        })
    );
  }

  login(username: string, password: string) {
    return this.httpClient.post(`${this.server}/SnoozeUsers/login`, {username, password}).pipe(
        map( (res) => {
          //console.log(res);
          // @ts-ignore
          this.token = res.id;
          this.saveToStorage('access_token', this.token);
          return res;
        })
    );
  }

  changePassword(oldPassword: string, newPassword: string) {
    let params = this.setParamToken(this.token);
    return this.httpClient.post(`${this.server}/SnoozeUsers/change-password`,  {oldPassword, newPassword},{params: params}).pipe(
        map( (res) => {
          //console.log(res);
          return res;
        })
    );
  }

  recoverPassword(email: string){
    // let params = this.setParamToken(this.token);
    return this.httpClient.post(`${this.server}/SnoozeUsers/reset`,  {email}).pipe(
        map( (res) => {
          return res;
        })
    );
  }

  getUser() {
    let params = this.setParamToken(this.token);
    return this.httpClient.get(`${this.server}/SnoozeUsers/GetUserData`, {params: params}).pipe(
        map((res) => {
          // @ts-ignore
          this.user = res;
          this.currentUserSubject.next(this.user);
          this.saveToStorage('user', this.user);
          return this.user;
        })
    )
  }

  logOut() {
    this.getToken();
    let params = this.setParamToken(this.token);
    return this.httpClient.post(`${this.server}/SnoozeUsers/logout`, {}, {params: params}).pipe(
        map((res) => {
          return res;
        })
    )
  }

  getCapsules() {
    this.getToken();
    let params = this.setParamToken(this.token);
    return this.httpClient.get(`${this.server}/Capsules`, {params: params}).pipe(
        map((res) => {
          return res;
        })
    )
  }

  getCapsuleById(id) {
    this.getToken();
    let params = this.setParamToken(this.token);
    return this.httpClient.get(`${this.server}/Capsules/${id}`, {params: params}).pipe(
        map((res) => {
          return res;
        })
    )
  }

  getCapsuleAvailability(id: number, date: string) {
    this.getToken();
    let params = new HttpParams();
    params = params.append('access_token', this.token);
    params = params.append('date', date);

    return this.httpClient.get(`${this.server}/Capsules/${id}/available`, {params: params}).pipe(
        map((res) => {
          return res;
        })
    )
  }

  bookCapsule(Capsule_id: number, Pin: number, Date: string, FirstTimeFrame: number, LastTimeFrame: number, Vendor: string, Amount: number, IsVerified: boolean, PayerEmail: string, PayedAmount: number, PayedDate: string, Payment_id: string) {
    var SnoozeUser_id;

    this.currentUser.subscribe(data =>{
      SnoozeUser_id = data.id;
    });

    let params = this.setParamToken(this.token);
    return this.httpClient.post(`${this.server}/Bookings/`, {SnoozeUser_id, Capsule_id, Pin, Date, FirstTimeFrame, LastTimeFrame, Vendor, Amount, IsVerified, PayerEmail, PayedAmount, PayedDate, Payment_id}, {params: params}).pipe(
        map((res) => {
          return res;
        })
    ) 
  }


  setLightPreference(lightLevel: number) {
    this.getToken();
    let params = this.setParamToken(this.token);
    return this.httpClient.patch(`${this.server}/CapsulePreferences`, {"LightLevel": lightLevel}, {params: params}).pipe(
        map((res) => {
          return res;
        })
    )
  }

  setVolumePreference(volume: number) {
    this.getToken();
    let params = this.setParamToken(this.token);
    return this.httpClient.patch(`${this.server}/CapsulePreferences`, {"VolumenLevel": volume}, {params: params}).pipe(
        map((res) => {
          return res;
        })
    )
  }

  //HELPER METHODS
  logOutLocally() {
    this.storage.remove('user');
    this.storage.remove('access_token');
    this.storage.remove('futureBookings');
    this.storage.set('isFirstTime', true);
    return true
  }

  setParamToken(token) {
    let params = new HttpParams();
    params = params.append('access_token', token);
    return params
  }

  getCurrentUser() {
    return this.storage.get('user').then(user => {
      return user;
    })
  }

  public get currentUserValue() : User {
    return this.currentUserSubject.value;
  }

  getToken() {
    return this.storage.get('access_token').then(token => {
      this.token = token;
      return token;
    })
  }

  async saveToStorage(key: string, value: any) {
    return await this.storage.set(key, value);
  }
}
