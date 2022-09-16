import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTrainingEventDialogComponent } from './delete-training-event-dialog.component';

describe('DeleteTrainingEventDialogComponent', () => {
  let component: DeleteTrainingEventDialogComponent;
  let fixture: ComponentFixture<DeleteTrainingEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteTrainingEventDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteTrainingEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
