import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

import { AuthService} from './auth/auth.service';
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  sessionId: string;
  constructor(private storage: Storage, private authService : AuthService) {

  }

  ngOnInit() {

  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /*
    let currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
    }
    */
    request = request.clone({
      withCredentials: true,
    });
    return next.handle(request);
  }

  async setSessId() {
    this.sessionId = await this.storage.get('roundcube_sessid');
  }

}
