import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { CognitoService } from './cognito.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'crux-route';

  url: string;

  isAuthenticated: boolean;

  constructor(private router: Router, private cognitoService: CognitoService) {
    this.isAuthenticated = false;
  }

  public ngOnInit(): void {
    this.router.events.subscribe((event) => {
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
    this.cognitoService
      .signOut()
      .then(() => {
        this.router.navigate(['/signIn']);
      })
      .catch((error) => {
        this.router.navigate(['/signIn']);
      });
  }
}
