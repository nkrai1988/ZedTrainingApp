import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewprogrammeComponent } from './newprogramme.component';

describe('NewprogrammeComponent', () => {
  let component: NewprogrammeComponent;
  let fixture: ComponentFixture<NewprogrammeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewprogrammeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewprogrammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
