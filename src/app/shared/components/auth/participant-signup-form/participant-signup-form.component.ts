import { Component } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../ui/alert/alert.component';
import { ComponentCardComponent } from '../../common/component-card/component-card.component';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-participant-signup-form',
  imports: [
    LabelComponent,
    ButtonComponent,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    AlertComponent,
    ComponentCardComponent,
  ],
  templateUrl: './participant-signup-form.component.html',
  styles: ``
})
export class ParticipantSignupFormComponent {

  currentStep = 1;
  categories: any[] = [];
  showPassword = false;
  showConfirmPassword = false;
  btntext = 'Register';

  signupForm!: FormGroup;
  submitted = false;
  successMessage = '';
  errormessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      orgCategory: ['', [Validators.required]],
      orgSubCategory: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

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
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  get f() { return this.signupForm.controls; }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onRegister() {
    this.submitted = true;
    this.errormessage = '';
    this.successMessage = '';

    if (this.signupForm.invalid) return;

    this.btntext = 'Processing...';
    const payload = {
      orgCategory: this.f['orgCategory'].value,
      orgSubCategory: this.f['orgSubCategory'].value,
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      email: this.f['email'].value,
      mobile: this.f['mobile'].value,
      password: this.f['password'].value,
    };

    this.authService.postParticipantRegister(payload).subscribe({
      next: (msg: any) => {
        console.log({'msg':msg});
        // this.successMessage = typeof msg === 'string'
        //   ? msg
        //   : 'Registration successful! Please check your email and click the verification link to activate your account.';
        this.successMessage ='Registration successful! Please check your email and click the verification link to activate your account.';
        this.btntext = 'Register';
        this.submitted = false;
        this.signupForm.reset();
      },
      error: (error) => {
        console.log({'error':error});
        this.btntext = 'Register';
        this.errormessage = (error.error) ? error.error : 'Registration failed. Please try again.';
      }
    });
  }
}
