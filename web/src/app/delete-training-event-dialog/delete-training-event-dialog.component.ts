import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../base/base.component';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-delete-training-event-dialog',
  templateUrl: './delete-training-event-dialog.component.html',
  styleUrls: ['./delete-training-event-dialog.component.scss'],
})
export class DeleteTrainingEventDialogComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  isUpdating: boolean = false;
  personId: string;
  eventId: string;
  eventDescription: string;

  constructor(
    private eventService: EventService,
    private dialogRef: MatDialogRef<DeleteTrainingEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    super();
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
    this.eventService
      .deleteEvent(this.eventId, this.personId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((resp) => {
        this.dialogRef.close();
      });
  }
}
