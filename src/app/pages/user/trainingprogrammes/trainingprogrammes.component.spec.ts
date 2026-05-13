import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingprogrammesComponent } from './trainingprogrammes.component';

describe('TrainingprogrammesComponent', () => {
  let component: TrainingprogrammesComponent;
  let fixture: ComponentFixture<TrainingprogrammesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingprogrammesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingprogrammesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
