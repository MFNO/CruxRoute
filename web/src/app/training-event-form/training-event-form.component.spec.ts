import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingEventFormComponent } from './training-event-form.component';

describe('TrainingEventFormComponent', () => {
  let component: TrainingEventFormComponent;
  let fixture: ComponentFixture<TrainingEventFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingEventFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
