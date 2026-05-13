import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessordashboardComponent } from './assessordashboard.component';

describe('AssessordashboardComponent', () => {
  let component: AssessordashboardComponent;
  let fixture: ComponentFixture<AssessordashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessordashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessordashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
