import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AutomaticLoginGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    return this.auth.user.pipe(
      take(1),
      map(user => {
        if (!user) {
          return true;
        } else {
          const role = user['role'];
          if (role == 'BUYER') {
            this.router.navigateByUrl('/buyer');
          } else if (role == 'SELLER') {
            this.router.navigateByUrl('/seller');
          } else {
          return false;
          }
        }
      })
    );  
  }
  
}
