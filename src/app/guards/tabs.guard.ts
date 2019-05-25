import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {Storage} from '@ionic/storage';
import {ToastController} from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})

export class TabsGuard implements CanActivate {
  constructor(private storage: Storage, private router: Router, private toastController: ToastController) { }

  async canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
  ): Promise<boolean> {

    const user = await this.storage.get('user');
    if (!user) {
      this.router.navigateByUrl('/login');
      this.toast('Please log in again')
    }
    return user;
  }


  async toast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
