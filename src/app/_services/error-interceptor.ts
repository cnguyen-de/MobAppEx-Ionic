import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {catchError} from 'rxjs/operators';

import {ApiService} from './api/api.service';
import {Router} from '@angular/router';
import {Storage } from '@ionic/storage';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private apiService: ApiService, private router: Router, private storage: Storage) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.storage.remove('user');
        this.storage.remove('access_token');
        this.router.navigateByUrl('/login');
        location.reload(true);
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }))
  }
}
