import { Component, OnDestroy, OnInit } from '@angular/core';
import { offset } from '@popperjs/core';
import { catchError, ignoreElements, Observable, of, takeUntil } from 'rxjs';
import { BaseComponent } from '../base/base.component';
import { CoachAthleteService } from '../services/coach-athlete.service';
import { CognitoService } from '../services/cognito.service';
import { CoachAthlete } from '../shared/coach-athlete';

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
  $coach: Observable<CoachAthlete>;
  $error: any;
  athleteId: string;

  constructor(
    private coachAthleteService: CoachAthleteService,
    private cognitoService: CognitoService
  ) {
    super();
  }

  acceptInvitation(coachMail: string, athleteMail: string): void {
    this.$coach = this.coachAthleteService
      .postCoachAthlete({
        athleteMail: athleteMail,
        coachMail: coachMail,
        linked: true,
      })
      .pipe(takeUntil(this.onDestroy$));
  }

  declineInvitation(coachMail: string, athleteMail: string): void {
    this.coachAthleteService.postCoachAthlete({
      athleteMail: athleteMail,
      coachMail: coachMail,
      linked: true,
    });
  }

  ngOnInit(): void {
    this.cognitoService
      .getCurrentUser()
      .then((user: any) => {
        this.athleteId = user.username;
      })
      .then(() => {
        this.$coach = this.coachAthleteService.getCoachAthlete(this.athleteId);
        this.$error = this.$coach.pipe(
          ignoreElements(),
          catchError((err) => of(err))
        );
      });
  }
}
