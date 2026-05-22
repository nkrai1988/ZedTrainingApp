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
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(64)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
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
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      email: this.f['email'].value,
      mobile: this.f['mobile'].value,
      password: this.f['password'].value,
    };

    this.authService.postParticipantRegister(payload).subscribe({
      next: () => {
        this.successMessage = 'Registration successful! You can now sign in.';
        this.btntext = 'Register';
        setTimeout(() => this.router.navigate(['/participant/signin']), 2000);
      },
      error: (error) => {
        this.btntext = 'Register';
        this.errormessage = (error.error) ? error.error : 'Registration failed. Please try again.';
      }
    });
  }
}
