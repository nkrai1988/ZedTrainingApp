import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyallotmentComponent } from './facultyallotment.component';

describe('FacultyallotmentComponent', () => {
  let component: FacultyallotmentComponent;
  let fixture: ComponentFixture<FacultyallotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacultyallotmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacultyallotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
