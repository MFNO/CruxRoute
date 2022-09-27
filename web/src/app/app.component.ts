import { ThisReceiver } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription, takeUntil } from 'rxjs';
import { BaseComponent } from './base/base.component';
import { CognitoService } from './services/cognito.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends BaseComponent implements OnInit, OnDestroy {
  title = 'crux-route';

  url: string;

  isUserAuthenticated: boolean;
  currentUserRole: string;

  constructor(private router: Router, private cognitoService: CognitoService) {
    super();
    this.isUserAuthenticated = false;
  }

  public ngOnInit(): void {
    this.router.events.pipe(takeUntil(this.onDestroy$)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.url = event.url;
        this.cognitoService.isAuthenticated().then((success: boolean) => {
          this.isUserAuthenticated = success;
        });
        this.cognitoService
          .getCurrentRole()
          .then((res) => (this.currentUserRole = res))
          .catch((err) => console.log(err));
      }
    });
  }

  public signOut(): void {
    this.isUserAuthenticated = false;
    console.log(this.isUserAuthenticated);
    this.cognitoService.signOut().then((res) => {
      this.router.navigate(['/signIn']);
    });
  }
}
