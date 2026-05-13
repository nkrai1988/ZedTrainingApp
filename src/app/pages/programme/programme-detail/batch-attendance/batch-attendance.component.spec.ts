import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchAttendanceComponent } from './batch-attendance.component';

describe('BatchAttendanceComponent', () => {
  let component: BatchAttendanceComponent;
  let fixture: ComponentFixture<BatchAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
