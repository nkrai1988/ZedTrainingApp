// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HelperService } from '../services/helper.service';
//import { AuthService } from './auth.service';  // your service

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private helper: HelperService, private router: Router) {}

  canActivate():
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      console.log({'router':this.router})
    if (this.helper.isLoggedIn()) {
      return true;
    }
    return this.router.parseUrl('/signin');
  }
}
