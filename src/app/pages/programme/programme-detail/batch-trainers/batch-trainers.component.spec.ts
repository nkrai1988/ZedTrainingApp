import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchTrainersComponent } from './batch-trainers.component';

describe('BatchTrainersComponent', () => {
  let component: BatchTrainersComponent;
  let fixture: ComponentFixture<BatchTrainersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchTrainersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchTrainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
