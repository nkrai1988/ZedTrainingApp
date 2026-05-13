import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationMetricsComponent } from './certification-metrics.component';

describe('CertificationMetricsComponent', () => {
  let component: CertificationMetricsComponent;
  let fixture: ComponentFixture<CertificationMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificationMetricsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificationMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
