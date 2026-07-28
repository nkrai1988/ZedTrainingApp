import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-participant-forgot-password-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './participant-forgot-password-form.component.html',
})
export class ParticipantForgotPasswordFormComponent {
  step: 1 | 2 = 1;

  emailForm!: FormGroup;
  otpForm!: FormGroup;

  submittedEmail = false;
  submittedOtp = false;
  isLoading = false;
  errormessage = '';
  successmessage = '';
  sentToEmail = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]]
    });
  }

  get ef() { return this.emailForm.controls; }
  get of() { return this.otpForm.controls; }

  sendCode() {
    this.submittedEmail = true;
    this.errormessage = '';
    if (this.emailForm.invalid) return;

    this.isLoading = true;
    this.authService.postParticipantForgotPassword(this.emailForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.sentToEmail = this.emailForm.value.email;
        this.step = 2;
      },
      error: () => {
        this.isLoading = false;
        this.errormessage = 'Something went wrong. Please try again.';
      }
    });
  }

  verifyCode() {
    this.submittedOtp = true;
    this.errormessage = '';
    if (this.otpForm.invalid) return;

    this.isLoading = true;
    const payload = { email: this.sentToEmail, otp: this.otpForm.value.otp };
    this.authService.postParticipantVerifyResetOtp(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.successmessage = 'Your credentials have been sent to your email. Redirecting to sign in...';
        setTimeout(() => this.router.navigate(['/participant/signin']), 3000);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errormessage = (err?.error && typeof err.error === 'string')
          ? err.error
          : 'Invalid or expired code. Please try again.';
      }
    });
  }

  resendCode() {
    this.otpForm.reset();
    this.submittedOtp = false;
    this.errormessage = '';
    this.step = 1;
    this.submittedEmail = false;
    this.emailForm.patchValue({ email: this.sentToEmail });
  }
}
