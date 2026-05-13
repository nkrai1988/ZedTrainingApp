import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammedetailComponent } from './programmedetail.component';

describe('ProgrammedetailComponent', () => {
  let component: ProgrammedetailComponent;
  let fixture: ComponentFixture<ProgrammedetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgrammedetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgrammedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
