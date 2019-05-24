import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})

export class SlidesGuard implements CanActivate {
  constructor(private storage: Storage, private router: Router) {}

  async canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
  ): Promise<boolean> {

    const isComplete = await this.storage.get('slidesDone');
    if (!isComplete) {
      this.router.navigateByUrl('/slides');
    }
    return isComplete;
  }
}
