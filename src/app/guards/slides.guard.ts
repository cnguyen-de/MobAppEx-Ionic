import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})

export class SlidesGuard implements CanActivate {
  token: any;

  constructor(private storage: Storage, private router: Router) {}

  async canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
  ): Promise<boolean> {
    this.getAccessToken();
    const isComplete = await this.storage.get('slidesDone');
    if (!isComplete) {
      this.router.navigateByUrl('/slides');
    } else if (this.token != null) {
      this.router.navigateByUrl('/snooze/capsules');
    }
    return isComplete;
  }

  async getAccessToken() {
    this.token = await this.storage.get('access_token');
  }
}

