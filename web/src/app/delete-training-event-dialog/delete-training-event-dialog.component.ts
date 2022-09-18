import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-delete-training-event-dialog',
  templateUrl: './delete-training-event-dialog.component.html',
  styleUrls: ['./delete-training-event-dialog.component.scss'],
})
export class DeleteTrainingEventDialogComponent implements OnInit, OnDestroy {
  isUpdating: boolean = false;
  personId: string;
  eventId: string;
  eventDescription: string;

  subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach((res) => res.unsubscribe());
  }

  constructor(
    private eventService: EventService,
    private dialogRef: MatDialogRef<DeleteTrainingEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.personId = data.personId;
    this.eventId = data.eventId;
    this.eventDescription = data.eventDescription;
  }

  ngOnInit(): void {}

  close(): void {
    this.dialogRef.close();
  }

  deleteEvent(): void {
    this.isUpdating = true;
    this.subscriptions.push(
      this.eventService
        .deleteEvent(this.eventId, this.personId)
        .subscribe((resp) => {
          this.dialogRef.close();
        })
    );
  }
}
