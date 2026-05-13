import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisingPartnersComponent } from './organising-partners.component';

describe('OrganisingPartnersComponent', () => {
  let component: OrganisingPartnersComponent;
  let fixture: ComponentFixture<OrganisingPartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisingPartnersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganisingPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
