import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchParticipantsComponent } from './batch-participants.component';

describe('BatchParticipantsComponent', () => {
  let component: BatchParticipantsComponent;
  let fixture: ComponentFixture<BatchParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchParticipantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
