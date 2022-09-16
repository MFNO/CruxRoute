import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { colors } from '../shared/colors';
import { EventService } from './services/event.service';
import { TrainingEvent } from '../shared/training-event';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
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
          id: trainingEvent.id,
          title: trainingEvent.description,
          start: new Date(trainingEvent.date),
          color: colors.yellow,
          allDay: true,
        };
      });
      this.isLoaded = true;
    });
  }

  openDialog(currentDate: Date) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = { date: currentDate };

    const dialogRef = this.dialog.open(
      TrainingEventFormComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      this.fetchEvents();
    });
  }
}
