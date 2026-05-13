import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortaltabComponent } from './portaltab.component';

describe('PortaltabComponent', () => {
  let component: PortaltabComponent;
  let fixture: ComponentFixture<PortaltabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortaltabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortaltabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
