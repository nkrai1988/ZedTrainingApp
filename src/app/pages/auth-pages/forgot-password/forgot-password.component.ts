import { Component } from '@angular/core';
import { ForgotPasswordFormComponent } from '../../../shared/components/auth/forgot-password-form/forgot-password-form.component';

@Component({
  selector: 'app-forgot-password',
  imports: [ForgotPasswordFormComponent],
  template: `<app-forgot-password-form />`
})
export class ForgotPasswordComponent {}
