import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../base/base.component';
import { CoachAthleteService } from '../services/coach-athlete.service';
import { CognitoService } from '../services/cognito.service';
import { CoachAthlete } from '../shared/coach-athlete';

@Component({
  selector: 'app-add-coach-athlete',
  templateUrl: './add-coach-athlete.component.html',
  styleUrls: ['./add-coach-athlete.component.scss'],
})
export class AddCoachAthleteComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  isUpdating: boolean;
  user: any;

  coachAthleteForm = new FormGroup({
    athleteMail: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    private cognitoService: CognitoService,
    private coachAthleteService: CoachAthleteService
  ) {
    super();
    this.cognitoService.getCurrentUser().then((user: any) => {
      this.user = user.attributes;
      console.log(this.user);
    });
  }

  ngOnInit(): void {}

  addCoachAthlete(): void {
    this.isUpdating = true;
    const athleteMail = this.coachAthleteForm.get('athleteMail')!.value;

    if (athleteMail && this.user.email) {
      const coachAthlete: CoachAthlete = {
        coachMail: this.user.email,
        linked: false,
        athleteMail: athleteMail,
      };
      this.coachAthleteService
        .postCoachAthlete(coachAthlete)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((resp) => {
          console.log(resp);
        });
    }
  }
}
