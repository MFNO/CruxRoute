import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventService } from '../calendar-month-view/services/event.service';
import { CognitoService } from '../cognito.service';
import { TrainingEvent } from '../shared/training-event';

@Component({
  selector: 'app-add-training-event-dialog',
  templateUrl: './add-training-event-dialog.component.html',
  styleUrls: ['./add-training-event-dialog.component.scss'],
})
export class AddTraingEventDialogComponent implements OnInit {
  isUpdating: boolean = false;
  currentDate: string;
  user: any;

  trainingEventForm = new FormGroup({
    date: new FormControl(''),
    description: new FormControl(''),
  });

  constructor(
    private eventService: EventService,
    private dialogRef: MatDialogRef<AddTraingEventDialogComponent>,
    private cognitoService: CognitoService,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.trainingEventForm.controls['date'].setValue(data.date);
    this.cognitoService.getUser().then((user: any) => {
      this.user = user.attributes;
    });
  }

  ngOnInit(): void {}

  //for testing purposes only, will have to be moved to back-end
  makeid(length: number): string {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  close(): void {
    this.dialogRef.close();
  }

  addEvent(): void {
    this.isUpdating = true;
    const date = this.trainingEventForm.get('date')!.value;
    const description = this.trainingEventForm.get('description')!.value;
    const personId = this.user.sub;

    if (date && description && personId) {
      const trainingEvent: TrainingEvent = {
        id: this.makeid(10),
        personId: personId,
        date: date,
        description: description,
      };
      this.eventService.postEvent(trainingEvent).subscribe((resp) => {
        this.dialogRef.close();
      });
    }
  }
}
