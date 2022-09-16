import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { isSameMonth, isSameDay } from 'date-fns';
import { colors } from '../shared/colors';
import { Film } from './interfaces/film';
import { EventService } from './services/event.service';
import { TrainingEvent } from '../shared/training-event';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { TrainingEventFormComponent } from '../training-event-form/training-event-form.component';

@Component({
  selector: 'app-calendar-month-view',
  templateUrl: './calendar-month-view.component.html',
  styleUrls: ['./calendar-month-view.component.scss'],
})
export class CalendarMonthViewComponent implements OnInit {
  TrainingEvents: any = [];

  isLoaded: boolean = false;

  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  events: CalendarEvent<{ trainingEvent: TrainingEvent }>[];

  activeDayIsOpen: boolean = false;

  constructor(private eventService: EventService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.eventService.getEvents().subscribe((events) => {
      this.events = events.map((trainingEvent: TrainingEvent) => {
        return {
          title: trainingEvent.description,
          start: new Date(trainingEvent.date),
          color: colors.yellow,
          allDay: true,
        };
      });
      this.isLoaded = true;
    });
  }

  dayClicked({
    date,
    events,
  }: {
    date: Date;
    events: CalendarEvent<{ film: Film }>[];
  }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventClicked(event: CalendarEvent<{ film: Film }>): void {
    if (event.meta) {
      window.open(
        `https://www.themoviedb.org/movie/${event.meta.film.id}`,
        '_blank'
      );
    }
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;

    //this.dialog.open(TrainingEventFormComponent, dialogConfig);

    const dialogRef = this.dialog.open(
      TrainingEventFormComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      this.fetchEvents();
    });
  }
}
