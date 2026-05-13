import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatordetailComponent } from './coordinatordetail.component';

describe('CoordinatordetailComponent', () => {
  let component: CoordinatordetailComponent;
  let fixture: ComponentFixture<CoordinatordetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinatordetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordinatordetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
