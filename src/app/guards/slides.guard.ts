import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})

export class SlidesGuard implements CanActivate {
  session: any;

  constructor(private storage: Storage, private router: Router) {}

  async canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
  ): Promise<boolean> {
    this.getSession();
    const isComplete = await this.storage.get('slidesDone');
    if (!isComplete) {
      this.router.navigateByUrl('/slides');
    } else if (this.session != null) {
      this.router.navigateByUrl('/tabs/tab1');
    }
    return isComplete;
  }

  async getSession() {
    this.session = await this.storage.get('session');
  }
}

