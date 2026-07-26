import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { HelperService } from '../../../../services/helper.service';

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
export class ParticipantSigninFormComponent {

  showPassword = false;
  btntext = 'Sign In';

  signinForm!: FormGroup;
  submitted = false;
  errormessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}
  private helperService = inject(HelperService);

  ngOnInit() {
    this.errormessage = '';
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.maxLength(64)]],
      rememberMe: [false]
    });
  }

  get f() { return this.signinForm.controls; }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    this.submitted = true;
    if (this.signinForm.invalid) return;

    this.btntext = 'Processing...';
    this.authService.postParticipantSignIn(this.signinForm.value).subscribe({
      next: (response: any) => {
        this.helperService.storeLoginData(response);
        this.router.navigate(['/participantdashboard']);
      },
      error: (error) => {
        this.btntext = 'Sign In';
        this.errormessage = (error.error) ? error.error : 'Login failed. Please try again';
      }
    });
  }
}
