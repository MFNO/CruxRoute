import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EventService } from '../calendar-month-view/services/event.service';
import { TrainingEvent } from '../shared/training-event';

@Component({
  selector: 'app-training-event-form',
  templateUrl: './training-event-form.component.html',
  styleUrls: ['./training-event-form.component.scss'],
})
export class TrainingEventFormComponent implements OnInit {
  @Input() trainingEvents: TrainingEvent[];

  trainingEventForm = new FormGroup({
    date: new FormControl(''),
    description: new FormControl(''),
  });

  constructor(private eventService: EventService) {}

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

  addEvent(): void {
    const date = this.trainingEventForm.get('date')!.value;
    const description = this.trainingEventForm.get('description')!.value;
    if (date && description) {
      const trainingEvent: TrainingEvent = {
        id: this.makeid(10),
        date: date,
        description: description,
      };
      console.log('adding event');
      this.eventService
        .postEvent(trainingEvent)
        .subscribe((resp) => console.log(resp));
    }
  }
}
