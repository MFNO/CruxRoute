import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../base/base.component';
import { CoachAthleteService } from '../services/coach-athlete.service';
import { CognitoService } from '../services/cognito.service';
import { Coach } from '../shared/coach';
import { Attribute } from '../shared/cognitoUser';

@Component({
  selector: 'app-coach-overview',
  templateUrl: './coach-overview.component.html',
  styleUrls: ['./coach-overview.component.scss'],
})
export class CoachOverviewComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  coach: Coach;
  athleteId: string;
  isLoading: boolean = true;
  coachEmail: string;

  constructor(
    private coachAthleteService: CoachAthleteService,
    private cognitoService: CognitoService
  ) {
    super();
  }

  ngOnInit(): void {
    this.cognitoService
      .getCurrentUser()
      .then((user: any) => {
        this.athleteId = user.attributes['sub'];
        console.log(this.athleteId);
      })
      .then(() => {
        this.coachAthleteService
          .getCoachAthlete(this.athleteId)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((coach: Coach) => {
            this.coach = coach;
            this.isLoading = false;
            let email = coach.Attributes.find(
              (attribute) => attribute.Name === 'email'
            );
            if (email) {
              this.coachEmail = email?.Value;
            }
          });
      });
  }
}
