import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-participant-signup-form',
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './participant-signup-form.component.html',
  styles: ``
})
export class ParticipantSignupFormComponent {

  currentStep = 1;
  categories: any[] = [];
  btntext = 'Next';

  signupForm!: FormGroup;
  submitted = false;
  successMessage = '';
  errormessage = '';
  registeredEmail = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      orgCategory:    ['', [Validators.required]],
      orgSubCategory: ['', [Validators.required]],
      firstName:      ['', [Validators.required, Validators.maxLength(50)]],
      lastName:       ['', [Validators.required, Validators.maxLength(50)]],
      email:          ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      mobile:         ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      aadhaarNumber:  ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      otpCode:        ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
    });

    this.authService.getParticipantCategories().subscribe({
      next: (data: any) => this.categories = data,
      error: () => {}
    });
  }

  get filteredSubCategories(): any[] {
    const selected = this.f['orgCategory'].value;
    return this.categories.find(c => c.value === selected)?.subCategories ?? [];
  }

  onCategoryChange() {
    this.f['orgSubCategory'].setValue('');
  }

  nextStep() {
    this.submitted = true;
    if (this.f['orgCategory'].invalid || this.f['orgSubCategory'].invalid) return;
    this.submitted = false;
    this.currentStep = 2;
  }

  prevStep() {
    this.currentStep = 1;
    this.submitted = false;
    this.errormessage = '';
  }

  verifyViaDigiLocker() {
    // DigiLocker OAuth integration — to be implemented
  }

  get f() { return this.signupForm.controls; }

  onRegister() {
    this.submitted = true;
    this.errormessage = '';

    const step2Invalid =
      this.f['firstName'].invalid ||
      this.f['lastName'].invalid ||
      this.f['email'].invalid ||
      this.f['mobile'].invalid ||
      this.f['aadhaarNumber'].invalid;

    if (step2Invalid) return;

    this.btntext = 'Processing...';
    const payload = {
      orgCategory:    this.f['orgCategory'].value,
      orgSubCategory: this.f['orgSubCategory'].value,
      firstName:      this.f['firstName'].value,
      lastName:       this.f['lastName'].value,
      email:          this.f['email'].value,
      mobile:         this.f['mobile'].value,
      aadhaarNumber:  this.f['aadhaarNumber'].value,
    };

    this.authService.postParticipantRegister(payload).subscribe({
      next: (res: any) => {
        this.btntext = 'Next';
        this.submitted = false;
        this.registeredEmail = res.email ?? payload.email;
        this.currentStep = 3;
      },
      error: (error) => {
        this.btntext = 'Next';
        this.errormessage = (error.error) ? error.error : 'Registration failed. Please try again.';
      }
    });
  }

  verifyOtp() {
    this.submitted = true;
    this.errormessage = '';

    if (this.f['otpCode'].invalid) return;

    this.btntext = 'Verifying...';
    this.authService.postParticipantVerifyOtp({
      email: this.registeredEmail,
      otp: this.f['otpCode'].value
    }).subscribe({
      next: () => {
        this.btntext = 'Verify';
        this.successMessage = 'Account created successfully! Your login credentials have been sent to your email.';
        this.currentStep = 4;
      },
      error: (error) => {
        this.btntext = 'Verify';
        this.errormessage = (error.error) ? error.error : 'OTP verification failed. Please try again.';
      }
    });
  }
}
