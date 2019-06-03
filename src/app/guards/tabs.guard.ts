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

    const token = await this.storage.get('access_token');
    if (!(typeof token == 'string')) {
      this.router.navigateByUrl('/login');
      return false;
    } else {
      return true;
    }
  }
}
