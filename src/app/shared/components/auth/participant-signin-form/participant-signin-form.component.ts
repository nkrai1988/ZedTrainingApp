import { Component, inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { HelperService } from '../../../../services/helper.service';
import { RecaptchaEnterpriseService } from '../../../../services/recaptcha-enterprise.service';

@Component({
  selector: 'app-participant-signin-form',
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './participant-signin-form.component.html',
  styles: ``
})
export class ParticipantSigninFormComponent implements AfterViewInit {

  @ViewChild('recaptchaContainer') recaptchaContainer!: ElementRef<HTMLDivElement>;

  showPassword = false;
  btntext = 'Sign In';

  signinForm!: FormGroup;
  submitted = false;
  errormessage = '';
  recaptchaToken: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private recaptchaService: RecaptchaEnterpriseService
  ) {}

  private helperService = inject(HelperService);

  ngOnInit() {
    this.errormessage = '';
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.maxLength(64)]]
    });
  }

  ngAfterViewInit() {
    this.recaptchaService.render(
      this.recaptchaContainer.nativeElement,
      (token) => { this.recaptchaToken = token; this.errormessage = ''; },
      () => { this.recaptchaToken = null; }
    );
  }

  get f() { return this.signinForm.controls; }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    this.submitted = true;
    if (this.signinForm.invalid) return;

    if (!this.recaptchaToken) {
      this.errormessage = 'Please complete the reCAPTCHA verification.';
      return;
    }

    this.btntext = 'Processing...';
    const payload = { ...this.signinForm.value, recaptchaToken: this.recaptchaToken };

    this.authService.postParticipantSignIn(payload).subscribe({
      next: (response: any) => {
        this.helperService.storeLoginData(response);
        this.router.navigate(['/participantdashboard']);
      },
      error: (error) => {
        this.btntext = 'Sign In';
        this.recaptchaToken = null;
        this.recaptchaService.reset();
        this.errormessage = (error.error) ? error.error : 'Login failed. Please try again';
      }
    });
  }
}
