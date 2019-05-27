import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient, private storage: Storage) {}

  server = this.storage.get('server').then((serverIP) => {
    this.server = serverIP;
  });

  token = this.storage.get('session').then(session => {
    this.token = session.id;
  });

  changePassword(oldPassword: string, newPassword: string) {
    return this.httpClient.post(`${this.server}/SnoozeUsers/change-password`, {oldPassword, newPassword}).pipe(
        map( (res) => {
          console.log(res);
        })
    );
  }
}
