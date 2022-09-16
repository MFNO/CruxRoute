import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTraingEventDialogComponent } from './add-training-event-dialog.component';

describe('TrainingEventFormComponent', () => {
  let component: AddTraingEventDialogComponent;
  let fixture: ComponentFixture<AddTraingEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTraingEventDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTraingEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
