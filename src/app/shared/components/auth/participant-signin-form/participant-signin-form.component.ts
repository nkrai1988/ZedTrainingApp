import { Component, inject } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../ui/alert/alert.component';
import { ComponentCardComponent } from '../../common/component-card/component-card.component';
import { AuthService } from '../../../../services/auth.service';
import { HelperService } from '../../../../services/helper.service';

@Component({
  selector: 'app-participant-signin-form',
  imports: [
    LabelComponent,
    ButtonComponent,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AlertComponent,
    ComponentCardComponent,
  ],
  templateUrl: './participant-signin-form.component.html',
  styles: ``
})
export class ParticipantSigninFormComponent {

  showPassword = false;
  btntext = 'Sign in';

  signinForm!: FormGroup;
  submitted = false;
  errormessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}
  private helperService = inject(HelperService);

  ngOnInit() {
    this.errormessage = '';
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(64)]],
      password: ['', [Validators.required, Validators.maxLength(64)]]
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
        this.btntext = 'Sign in';
        this.errormessage = (error.error) ? error.error : 'Login failed. Please try again';
      }
    });
  }
}
