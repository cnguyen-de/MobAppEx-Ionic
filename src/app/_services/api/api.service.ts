import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  token: string;
  userId: number;

  server = this.storage.get('server').then((serverIP) => {
    this.server = serverIP;
  });

  constructor(private httpClient: HttpClient, private storage: Storage, private authService: AuthService) {
    this.storage.get('server').then((serverIP) => {
      this.server = serverIP;
    });

    this.storage.get('access_token').then(token => {
      if (typeof token == 'string') {
        this.token = token;
      }
    });

    this.storage.get('user').then(user => {
      if  (user != null) {
        this.userId = user.id;
      }
    });
  }

  changePassword(oldPassword: string, newPassword: string) {
    let params = this.setParamToken(this.token)
    return this.httpClient.post(`${this.server}/SnoozeUsers/change-password`,  {oldPassword, newPassword},{params: params}).pipe(
        map( (res) => {
          //console.log(res);
          return res;
        })
    );
  }

  getUser(token) {
    this.token = token;
    let params = this.setParamToken(token)
    return this.httpClient.get(`${this.server}/SnoozeUsers/GetUserData`, {params: params}).pipe(
        map((res) => {
          //console.log(res);
          this.saveToStorage('user', res);
          return res;
        })
    )
  }

  getUserInfo() {
    let params = this.setParamToken(this.token);
    return this.httpClient.get(`${this.server}/SnoozeUsers/GetUserData`, {params: params}).pipe(
        map((res) => {
          //console.log(res);
          this.saveToStorage('user', res);
          return res;
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
    return this.httpClient.post(`${this.server}/Capsules`, {}, {params: params}).pipe(
        map((res) => {
          return res;
        })
    )
  }

  getCapsuleById(id) {
    this.getToken();
    let params = this.setParamToken(this.token);
    return this.httpClient.post(`${this.server}/Capsules/${id}`, {}, {params: params}).pipe(
        map((res) => {
          return res;
        })
    )
  }

  getToken() {
    return this.storage.get('access_token').then(token => {
      this.token = token;
      return token;
    })
  }

  setParamToken(token) {
    let params = new HttpParams();
    params = params.append('access_token', token);
    return params
  }


  async saveToStorage(key: string, value: any) {
    await this.storage.set(key, value);
  }
}
