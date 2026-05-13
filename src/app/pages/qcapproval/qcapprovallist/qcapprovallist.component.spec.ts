import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcapprovallistComponent } from './qcapprovallist.component';

describe('QcapprovallistComponent', () => {
  let component: QcapprovallistComponent;
  let fixture: ComponentFixture<QcapprovallistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QcapprovallistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QcapprovallistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
