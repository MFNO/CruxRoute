import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachOverviewComponent } from './coach-overview.component';

describe('CoachOverviewComponent', () => {
  let component: CoachOverviewComponent;
  let fixture: ComponentFixture<CoachOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoachOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
