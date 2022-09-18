import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { CognitoService } from '../services/cognito.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  isAuthenticated: boolean = false;
  constructor(private router: Router, private cognitoService: CognitoService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.cognitoService.isAuthenticated().then((success: boolean) => {
      if (success) {
        return true;
      } else {
        this.router.navigate(['/signIn'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }
    });
  }
}
