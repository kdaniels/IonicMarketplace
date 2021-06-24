import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router:Router, private auth: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const expectedRole = route.data.role;

      return this.auth.user.pipe(
        take(1),
        map(user => {
          if (!user) {
            return false;
          } else {
            const role = user['role'];
            if (expectedRole == role) {
              return true;
            } else {
              //this.auth.signOut(); // Should probably be removed
              this.router.navigateByUrl('/');
              return false;
            }
          }
        })
      );
  }
  
}
