import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CognitoService } from './services/cognito.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'crux-route';

  url: string;

  isAuthenticated: boolean;

  subscriptions: Subscription[] = [];

  constructor(private router: Router, private cognitoService: CognitoService) {
    this.isAuthenticated = false;
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((res) => res.unsubscribe());
  }

  public ngOnInit(): void {
    this.subscriptions.push(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.url = event.url;
          this.cognitoService.isAuthenticated().then((success: boolean) => {
            this.isAuthenticated = success;
          });
        }
      })
    );
  }

  public signOut(): void {
    this.isAuthenticated = false;
    console.log(this.isAuthenticated);
    this.cognitoService.signOut().then((res) => {
      this.router.navigate(['/signIn']);
    });
  }
}
