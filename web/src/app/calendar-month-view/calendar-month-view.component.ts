import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { colors } from '../shared/colors';
import { EventService } from '../services/event.service';
import { TrainingEvent } from '../shared/training-event';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddTraingEventDialogComponent } from '../add-training-event-dialog/add-training-event-dialog.component';
import { CognitoService } from '../services/cognito.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calendar-month-view',
  templateUrl: './calendar-month-view.component.html',
  styleUrls: ['./calendar-month-view.component.scss'],
})
export class CalendarMonthViewComponent implements OnInit, OnDestroy {
  TrainingEvents: any = [];

  isLoaded: boolean = false;

  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  user: any;

  events: CalendarEvent<{ trainingEvent: TrainingEvent }>[];

  activeDayIsOpen: boolean = false;

  subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach((res) => res.unsubscribe());
  }

  constructor(
    private eventService: EventService,
    private dialog: MatDialog,
    private cognitoService: CognitoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cognitoService.getUser().then((user: any) => {
      this.user = user.attributes;
      this.fetchEvents();
    });
  }

  fetchEvents(): void {
    this.subscriptions.push(
      this.eventService.getEvents(this.user.sub).subscribe((events) => {
        this.events = events.map((trainingEvent: TrainingEvent) => {
          return {
            id: trainingEvent.id,
            title: trainingEvent.description,
            start: new Date(trainingEvent.date),
            color: colors.yellow,
            allDay: true,
          };
        });
        this.isLoaded = true;
      })
    );
  }

  openDialog(currentDate: Date) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = { date: currentDate };

    const dialogRef = this.dialog.open(
      AddTraingEventDialogComponent,
      dialogConfig
    );

    this.subscriptions.push(
      dialogRef.afterClosed().subscribe(() => {
        this.fetchEvents();
      })
    );
  }
}
