import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCoachAthleteComponent } from './add-coach-athlete.component';

describe('AddCoachAthleteComponent', () => {
  let component: AddCoachAthleteComponent;
  let fixture: ComponentFixture<AddCoachAthleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCoachAthleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCoachAthleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
