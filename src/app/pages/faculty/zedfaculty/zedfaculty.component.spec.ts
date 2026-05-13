import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZedfacultyComponent } from './zedfaculty.component';

describe('ZedfacultyComponent', () => {
  let component: ZedfacultyComponent;
  let fixture: ComponentFixture<ZedfacultyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZedfacultyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZedfacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
