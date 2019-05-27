import { Injectable } from '@angular/core';
import {HttpClient, HttpParams } from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {map} from 'rxjs/operators';
import {AuthService} from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  token:string;

  userId: number;

  server = this.storage.get('server').then((serverIP) => {
    this.server = serverIP;
  });


  constructor(private httpClient: HttpClient, private storage: Storage, private authService: AuthService) {
    this.storage.get('access_token').then(token => {
      if (token != null) {
        this.token = token;
      }
    });
    this.storage.get('session').then(session => {
      if (session != null) {
        this.userId = session.userId;
      }
    });
  }

  changePassword(oldPassword: string, newPassword: string) {
    let params = this.setParamToken(this.token)
    return this.httpClient.post(`${this.server}/SnoozeUsers/change-password`,  {oldPassword, newPassword},{params: params}).pipe(
        map( (res) => {
          console.log(res);
        })
    );
  }

  getUser(userId, token) {
    let params = this.setParamToken(token)
    return this.httpClient.get(`${this.server}/SnoozeUsers/${userId}`, {params: params}).pipe(
        map((res) => {
          console.log(res);
          this.saveToStorage('user', res)
        })
    )
  }


  async setUserId() {

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
