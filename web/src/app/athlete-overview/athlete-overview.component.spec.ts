import { ComponentFixture, TestBed } from '@angular/core/testing';

import { athleteOverviewComponent } from './athlete-overview.component';

describe('athleteOverviewComponent', () => {
  let component: athleteOverviewComponent;
  let fixture: ComponentFixture<athleteOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [athleteOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(athleteOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
