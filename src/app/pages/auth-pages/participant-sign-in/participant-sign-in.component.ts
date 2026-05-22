import { Component } from '@angular/core';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';
import { ParticipantSigninFormComponent } from '../../../shared/components/auth/participant-signin-form/participant-signin-form.component';

@Component({
  selector: 'app-participant-sign-in',
  imports: [
    AuthPageLayoutComponent,
    ParticipantSigninFormComponent,
  ],
  templateUrl: './participant-sign-in.component.html',
  styles: ``
})
export class ParticipantSignInComponent {}
