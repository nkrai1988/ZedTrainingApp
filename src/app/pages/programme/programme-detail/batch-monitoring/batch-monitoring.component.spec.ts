import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchMonitoringComponent } from './batch-monitoring.component';

describe('BatchMonitoringComponent', () => {
  let component: BatchMonitoringComponent;
  let fixture: ComponentFixture<BatchMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchMonitoringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
