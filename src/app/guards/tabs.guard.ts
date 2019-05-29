import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Storage} from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})

export class TabsGuard implements CanActivate {
  constructor(private storage: Storage, private router: Router) { }

  async canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
  ): Promise<boolean> {

    const session = await this.storage.get('session');
    if (session == null) {
      this.router.navigateByUrl('/login');
      return false;
    } else {
      return true;
    }
  }
}
