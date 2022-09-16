import { Component, Input, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-event-display',
  templateUrl: './event-display.component.html',
  styleUrls: ['./event-display.component.scss'],
})
export class EventDisplayComponent implements OnInit {
  @Input() event: CalendarEvent;
  constructor() {}

  ngOnInit(): void {
    console.log(this.event);
  }
}
