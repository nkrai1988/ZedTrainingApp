import { Component } from '@angular/core';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';
import { ParticipantForgotPasswordFormComponent } from '../../../shared/components/auth/participant-forgot-password-form/participant-forgot-password-form.component';

@Component({
  selector: 'app-participant-forgot-password',
  imports: [AuthPageLayoutComponent, ParticipantForgotPasswordFormComponent],
  template: `
    <app-auth-page-layout>
      <app-participant-forgot-password-form class="flex flex-col flex-1"/>
    </app-auth-page-layout>
  `
})
export class ParticipantForgotPasswordComponent {}
