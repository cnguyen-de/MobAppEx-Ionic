import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {catchError} from 'rxjs/operators';

import {ApiService} from './api/api.service';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private apiService: ApiService, private router: Router, private toastController: ToastController) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.apiService.logOutLocally();
        this.router.navigateByUrl('/login');
      } else if (err.status === 0 || err.status === 504) {
        //this.toast("Unable to communicate with server")
      }

      const error = err.error.error.message;
      return throwError(error);
    }))
  }

  async toast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      cssClass: 'toast-container',
      keyboardClose: true
    });
    toast.present();
  }
}
