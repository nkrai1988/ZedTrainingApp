import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinneroneComponent } from './spinnerone.component';

describe('SpinneroneComponent', () => {
  let component: SpinneroneComponent;
  let fixture: ComponentFixture<SpinneroneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinneroneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpinneroneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
