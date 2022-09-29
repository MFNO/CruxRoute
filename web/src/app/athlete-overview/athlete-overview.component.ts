import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { isThisISOWeek } from 'date-fns';
import { catchError, takeUntil } from 'rxjs';
import { BaseComponent } from '../base/base.component';
import { CoachAthleteService } from '../services/coach-athlete.service';
import { CognitoService } from '../services/cognito.service';
import { CoachAthlete } from '../shared/coach-athlete';

@Component({
  selector: 'app-athlete-overview',
  templateUrl: './athlete-overview.component.html',
  styleUrls: ['./athlete-overview.component.scss'],
})
export class athleteOverviewComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  displayedColumns: string[] = ['email', 'linked'];
  athletes: CoachAthlete[];
  user: any;
  isUpdating: boolean = false;

  coachAthleteForm = new FormGroup({
    athleteMail: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.minLength(1),
    ]),
  });

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
        this.user = user;
      })
      .then(() => this.getAthletes());
  }

  getAthletes(): void {
    this.coachAthleteService
      .getAthletesByCoach(this.user.username)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((event) => {
        this.athletes = event;
      });
  }

  addCoachAthlete(): void {
    this.isUpdating = true;
    const athleteMail = this.coachAthleteForm.get('athleteMail')!.value;
    if (athleteMail && this.user.attributes.email) {
      const coachAthlete: CoachAthlete = {
        coachMail: this.user.email,
        linked: false,
        athleteMail: athleteMail,
      };
      this.coachAthleteService
        .postCoachAthlete(coachAthlete)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe({
          next: (athlete) => this.athletes.push(athlete),
          error: (e) => (this.isUpdating = false),
          complete: () => (this.isUpdating = false),
        });
    }
  }
}
