import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataloadinprogressComponent } from './dataloadinprogress.component';

describe('DataloadinprogressComponent', () => {
  let component: DataloadinprogressComponent;
  let fixture: ComponentFixture<DataloadinprogressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataloadinprogressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataloadinprogressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
