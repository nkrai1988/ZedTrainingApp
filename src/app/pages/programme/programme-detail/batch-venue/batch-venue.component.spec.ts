import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchVenueComponent } from './batch-venue.component';

describe('BatchVenueComponent', () => {
  let component: BatchVenueComponent;
  let fixture: ComponentFixture<BatchVenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchVenueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchVenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
