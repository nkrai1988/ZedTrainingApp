import { Component } from '@angular/core';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';
import { ParticipantSignupFormComponent } from '../../../shared/components/auth/participant-signup-form/participant-signup-form.component';

@Component({
  selector: 'app-participant-sign-up',
  imports: [
    AuthPageLayoutComponent,
    ParticipantSignupFormComponent,
  ],
  templateUrl: './participant-sign-up.component.html',
  styles: ``
})
export class ParticipantSignUpComponent {}
