import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorlistComponent } from './coordinatorlist.component';

describe('CoordinatorlistComponent', () => {
  let component: CoordinatorlistComponent;
  let fixture: ComponentFixture<CoordinatorlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinatorlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordinatorlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
