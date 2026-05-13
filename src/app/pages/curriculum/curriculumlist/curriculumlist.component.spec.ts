import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumlistComponent } from './curriculumlist.component';

describe('CurriculumlistComponent', () => {
  let component: CurriculumlistComponent;
  let fixture: ComponentFixture<CurriculumlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurriculumlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
