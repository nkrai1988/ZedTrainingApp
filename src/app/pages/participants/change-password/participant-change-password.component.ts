import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ParticipantService } from '../../../services/participant.service';

@Component({
  selector: 'app-participant-change-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './participant-change-password.component.html',
})
export class ParticipantChangePasswordComponent {

  form: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  showCurrent = false;
  showNew = false;
  showConfirm = false;

  constructor(
    private fb: FormBuilder,
    private participantService: ParticipantService,
    private router: Router,
  ) {
    this.form = this.fb.group(
      {
        oldpassword: ['', [Validators.required, Validators.minLength(4)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator },
    );
  }

  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pw = group.get('password')?.value ?? '';
    const cpw = group.get('confirmPassword')?.value ?? '';
    if (!pw || !cpw) return null;
    return pw === cpw ? null : { passwordsMismatch: true };
  }

  get newPasswordValue(): string {
    return this.form.get('password')?.value ?? '';
  }

  get hasMinLength(): boolean  { return this.newPasswordValue.length >= 8; }
  get hasUppercase(): boolean  { return /[A-Z]/.test(this.newPasswordValue); }
  get hasNumber(): boolean     { return /[0-9]/.test(this.newPasswordValue); }
  get hasSpecial(): boolean    { return /[^A-Za-z0-9]/.test(this.newPasswordValue); }

  get strengthScore(): number {
    return [this.hasMinLength, this.hasUppercase, this.hasNumber, this.hasSpecial]
      .filter(Boolean).length;
  }

  get strengthLabel(): string {
    const s = this.strengthScore;
    if (s <= 1) return 'Weak';
    if (s === 2) return 'Fair';
    if (s === 3) return 'Good';
    return 'Strong';
  }

  get strengthColor(): string {
    const s = this.strengthScore;
    if (s <= 1) return 'text-red-500';
    if (s === 2) return 'text-amber-500';
    if (s === 3) return 'text-blue-500';
    return 'text-green-500';
  }

  barClass(index: number): string {
    const filled = index < this.strengthScore;
    if (!filled) return 'bg-gray-200 dark:bg-gray-700';
    const s = this.strengthScore;
    if (s <= 1) return 'bg-red-500';
    if (s === 2) return 'bg-amber-500';
    if (s === 3) return 'bg-blue-500';
    return 'bg-green-500';
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.participantService.changePassword({
      oldPassword: this.form.value.oldpassword,
      newPassword: this.form.value.password,
      confirmPassword: this.form.value.confirmPassword,
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Password updated successfully.';
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/participantdashboard']);
        }, 2500);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to update password. Please check your current password.';
        setTimeout(() => { this.errorMessage = ''; }, 4000);
      },
    });
  }

  cancel() {
    this.router.navigate(['/participantdashboard']);
  }
}
