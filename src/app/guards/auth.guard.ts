import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HelperService } from '../services/helper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private helper: HelperService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.helper.isLoggedIn()) {
      return true;
    }
    if (state.url.includes('participant')) {
      return this.router.parseUrl('/participant/signin');
    }
    return this.router.parseUrl('/signin');
  }
}
