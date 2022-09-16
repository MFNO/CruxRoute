import { Component, Input, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { EventService } from '../calendar-month-view/services/event.service';

@Component({
  selector: 'app-event-display',
  templateUrl: './event-display.component.html',
  styleUrls: ['./event-display.component.scss'],
})
export class EventDisplayComponent implements OnInit {
  @Input() event: CalendarEvent;
  constructor(private eventService: EventService) {}

  ngOnInit(): void {}

  deleteEvent(): void {
    if (this.event.id) {
      const eventId = '' + this.event.id;
      const personId = '1';
      this.eventService
        .deleteEvent(eventId, personId)
        .subscribe((resp) => console.log(resp));
    }
  }
}
