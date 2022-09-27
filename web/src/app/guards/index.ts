import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CognitoService } from '../services/cognito.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  isAuthenticated: boolean = false;
  constructor(private router: Router, private cognitoService: CognitoService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let url: string = state.url;
    return this.checkUserLogin(next, url);
  }

  checkUserLogin(route: ActivatedRouteSnapshot, url: any): Promise<boolean> {
    return this.cognitoService.isAuthenticated().then((success: boolean) => {
      if (success) {
        this.cognitoService.getCurrentUser().then((user: any) => {
          const role = user.attributes['custom:cruxRouteRole'];
          if (route.data['role'] && route.data['role'].indexOf(role) === -1) {
            this.router.navigate(['/calendar']);
            return false;
          }
          return true;
        });
        return true;
      } else {
        this.router.navigate(['/signIn'], {
          queryParams: { returnUrl: route.url },
        });
        return false;
      }
    });
  }
}
