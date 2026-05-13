import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatanotfoundComponent } from './datanotfound.component';

describe('DatanotfoundComponent', () => {
  let component: DatanotfoundComponent;
  let fixture: ComponentFixture<DatanotfoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatanotfoundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatanotfoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
