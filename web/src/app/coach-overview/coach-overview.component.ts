import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-coach-overview',
  templateUrl: './coach-overview.component.html',
  styleUrls: ['./coach-overview.component.scss'],
})
export class CoachOverviewComponent implements OnInit {
  isInvitePending: boolean;
  constructor() {}

  ngOnInit(): void {}
}
