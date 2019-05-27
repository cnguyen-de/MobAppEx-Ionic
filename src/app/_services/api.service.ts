import { Injectable } from '@angular/core';
import {HttpClient, HttpParams } from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  token: string;
  constructor(private httpClient: HttpClient, private storage: Storage) {
    this.setToken()
  }
  async setToken() {
    this.token = await this.storage.get('access_token')
  }
  server = this.storage.get('server').then((serverIP) => {
    this.server = serverIP;
  });

  changePassword(oldPassword: string, newPassword: string) {
    let params = new HttpParams();
    params = params.append('access_token', this.token);
    return this.httpClient.post(`${this.server}/SnoozeUsers/change-password`,  {oldPassword, newPassword},{params: params}).pipe(
        map( (res) => {
          console.log(res);
        })
    );
  }
}
