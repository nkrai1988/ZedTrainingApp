import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QmpdashboardComponent } from './qmpdashboard.component';

describe('QmpdashboardComponent', () => {
  let component: QmpdashboardComponent;
  let fixture: ComponentFixture<QmpdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QmpdashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QmpdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
