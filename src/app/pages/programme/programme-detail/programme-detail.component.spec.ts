import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammeDetailComponent } from './programme-detail.component';

describe('ProgrammeDetailComponent', () => {
  let component: ProgrammeDetailComponent;
  let fixture: ComponentFixture<ProgrammeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgrammeDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgrammeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
