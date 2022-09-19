import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtheleteOverviewComponent } from './athelete-overview.component';

describe('AtheleteOverviewComponent', () => {
  let component: AtheleteOverviewComponent;
  let fixture: ComponentFixture<AtheleteOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtheleteOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtheleteOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
