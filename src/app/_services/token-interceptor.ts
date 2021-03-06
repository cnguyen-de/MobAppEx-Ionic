import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  token: string;
  constructor(private storage: Storage) {

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
    this.setSessId().then(done => {
      request = request.clone({
        setParams: {
          access_token: this.token
        },
        withCredentials: true,
      });
    });

    return next.handle(request);
  }

  async setSessId() {
    this.token = await this.storage.get('access_token');
    return true
  }

}
