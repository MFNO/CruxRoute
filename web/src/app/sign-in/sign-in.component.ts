import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IUser, CognitoService } from '../services/cognito.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss', '../shared/shared.scss'],
})
export class SignInComponent {
  loading: boolean;
  user: IUser;

  constructor(private router: Router, private cognitoService: CognitoService) {
    this.loading = false;
    this.user = {} as IUser;
  }

  public signIn(): void {
    this.loading = true;
    this.cognitoService
      .signIn(this.user)
      .then(() => {
        console.log(this.user);
        this.router.navigate(['/calendar']);
      })
      .catch(() => {
        this.loading = false;
      });
  }
}
