import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProgrammListComponent } from './admin-programm-list.component';

describe('AdminProgrammListComponent', () => {
  let component: AdminProgrammListComponent;
  let fixture: ComponentFixture<AdminProgrammListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProgrammListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProgrammListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
