import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TrainingEvent } from '../shared/training-event';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { CoachAthlete } from '../shared/coach-athlete';
import { Coach } from '../shared/coach';

@Injectable({
  providedIn: 'root',
})
export class CoachAthleteService {
  url: string = environment.CoachAthleteLambdaStack.HttpApiUrl;
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getCoachAthlete(athleteId: string): Observable<Coach> {
    return this.http
      .get<any>(this.url + '/coachathletes/' + athleteId)
      .pipe(retry(1), catchError(this.handleError));
  }

  postCoachAthlete(coachAthlete: CoachAthlete): Observable<CoachAthlete> {
    return this.http
      .post<CoachAthlete>(
        this.url + '/coachathletes',
        JSON.stringify(coachAthlete),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => {
      return errorMessage;
    });
  }
}
