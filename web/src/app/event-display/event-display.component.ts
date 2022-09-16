import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { EventService } from '../calendar-month-view/services/event.service';
import { DeleteTrainingEventDialogComponent } from '../delete-training-event-dialog/delete-training-event-dialog.component';

@Component({
  selector: 'app-event-display',
  templateUrl: './event-display.component.html',
  styleUrls: ['./event-display.component.scss'],
})
export class EventDisplayComponent implements OnInit {
  @Input() event: CalendarEvent;
  @Output('fetchEvent') fetchEvents: EventEmitter<any> = new EventEmitter();
  constructor(private eventService: EventService, private dialog: MatDialog) {}

  ngOnInit(): void {}

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    if (this.event.id) {
      dialogConfig.data = {
        eventId: this.event.id,
        personId: '1',
        eventDescription: this.event.title,
      };
    }

    const dialogRef = this.dialog.open(
      DeleteTrainingEventDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      this.fetchEvents.emit();
    });
  }
}
