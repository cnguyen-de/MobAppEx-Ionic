import { Injectable } from  '@angular/core';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { tap } from  'rxjs/operators';
import { Observable, BehaviorSubject } from  'rxjs';

import { Storage } from  '@ionic/storage';
import { User } from  './user';
import { AuthResponse } from  './auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, private storage: Storage, private httpHeaders: HttpHeaders) { }

  authSubject  =  new  BehaviorSubject(false);

  headers = new HttpHeaders();
  server = this.storage.get('server').then((serverIP) => {
    this.server = serverIP;
    this.headers.append("Accept", 'application/json');
    this.headers.append('Content-Type', 'application/json' );
  })

  register(user: User): Observable<AuthResponse> {
    // @ts-ignore
    return this.httpClient.post<AuthResponse>(`${this.server}/SnoozeUsers`, user, this.headers).pipe(
        tap(async (res:  AuthResponse ) => {
          console.log(res)

          if (res.user) {
            this.authSubject.next(true);
          }
        })

    );
  }

  login(user: User): Observable<AuthResponse> {
    // @ts-ignore
    return this.httpClient.post(`${this.server}/SnoozeUsers/login`, user, this.headers).pipe(
        tap(async (res: AuthResponse) => {

          if (res.user) {
            await this.storage.set("ACCESS_TOKEN", res.user.id);
            await this.storage.set("EXPIRES_IN", res.user.ttl);
            await this.storage.set("USER_ID", res.user.user_id);
            this.authSubject.next(true);
          }
        })
    );
  }

  isLoggedIn() {
    return this.authSubject.asObservable();
  }

}
