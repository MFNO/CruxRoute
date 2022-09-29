import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TrainingEvent } from '../shared/training-event';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { CoachAthlete } from '../shared/coach-athlete';

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

  getCoachByAthlete(athleteId: string): Observable<CoachAthlete> {
    return this.http
      .get<CoachAthlete>(`${this.url}/coachathletes/${athleteId}/coach`)
      .pipe(retry(1), catchError(this.handleError));
  }

  getAthletesByCoach(coachId: string): Observable<CoachAthlete[]> {
    return this.http
      .get<CoachAthlete[]>(`${this.url}/coachathletes/${coachId}/athletes`)
      .pipe(retry(1), catchError(this.handleError));
  }

  postCoachAthlete(coachAthlete: CoachAthlete): Observable<CoachAthlete> {
    return this.http
      .post<CoachAthlete>(
        `${this.url}/coachathletes`,
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
