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

  isAuthenticated: boolean;

  constructor(private router: Router, private cognitoService: CognitoService) {
    super();
    this.isAuthenticated = false;
  }

  public ngOnInit(): void {
    this.router.events.pipe(takeUntil(this.onDestroy$)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.url = event.url;
        this.cognitoService.isAuthenticated().then((success: boolean) => {
          this.isAuthenticated = success;
        });
      }
    });
  }

  public signOut(): void {
    this.isAuthenticated = false;
    console.log(this.isAuthenticated);
    this.cognitoService.signOut().then((res) => {
      this.router.navigate(['/signIn']);
    });
  }
}
