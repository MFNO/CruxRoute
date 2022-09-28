import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, map, Observable, takeUntil } from 'rxjs';
import { BaseComponent } from '../base/base.component';
import { CoachAthleteService } from '../services/coach-athlete.service';
import { CognitoService } from '../services/cognito.service';

@Component({
  selector: 'app-coach-overview',
  templateUrl: './coach-overview.component.html',
  styleUrls: ['./coach-overview.component.scss'],
})
export class CoachOverviewComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  errorObject = null;
  $coach: Observable<any>;
  athleteId: string;
  athleteMail: string;
  coachId: string;
  coachMail: string;

  constructor(
    private coachAthleteService: CoachAthleteService,
    private cognitoService: CognitoService
  ) {
    super();
  }

  acceptInvitation(): void {
    this.coachAthleteService
      .postCoachAthlete({
        athleteEmail: this.athleteMail,
        coachEmail: this.coachMail,
        linked: true,
      })
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((resp) => {
        console.log(resp);
      });
  }

  declineInvitation(): void {
    this.coachAthleteService.postCoachAthlete({
      athleteEmail: this.athleteMail,
      coachEmail: this.coachMail,
      linked: true,
    });
  }

  ngOnInit(): void {
    this.cognitoService
      .getCurrentUser()
      .then((user: any) => {
        this.athleteId = user.username;
        this.athleteMail = user.attributes.email;
      })
      .then(() => {
        this.$coach = this.coachAthleteService
          .getCoachAthlete(this.athleteId)
          .pipe(
            map((x) => {
              this.coachId = x.Username;
              x.Attributes.forEach((attr) => {
                if (attr.Name === 'email') {
                  x.email = attr.Value;
                  this.coachMail = attr.Value;
                }
              });
              return x;
            })
          )
          .pipe(catchError((err) => (this.errorObject = err)));
      });
  }
}
