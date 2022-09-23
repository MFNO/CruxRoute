import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TrainingEvent } from '../shared/training-event';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import AwsSettings from '../aws-deploy-dev-config.json';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getEvents(personId: string): Observable<TrainingEvent[]> {
    return this.http.get<TrainingEvent[]>(
      AwsSettings.devTrainingEventLambdaStack.HttpApiUrl + '/events/' + personId
    );
  }

  postEvent(event: TrainingEvent): Observable<TrainingEvent> {
    return this.http
      .post<TrainingEvent>(
        AwsSettings.devTrainingEventLambdaStack.HttpApiUrl + '/events',
        JSON.stringify(event),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteEvent(eventId: string, personId: string): Observable<TrainingEvent> {
    return this.http
      .delete<TrainingEvent>(
        AwsSettings.devTrainingEventLambdaStack.HttpApiUrl +
          '/events/' +
          personId +
          '/' +
          eventId,
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
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
