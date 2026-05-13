import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewfacultyComponent } from './newfaculty.component';

describe('NewfacultyComponent', () => {
  let component: NewfacultyComponent;
  let fixture: ComponentFixture<NewfacultyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewfacultyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewfacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
