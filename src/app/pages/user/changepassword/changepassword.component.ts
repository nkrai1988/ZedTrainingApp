import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  imports: [
    ComponentCardComponent,
    AlertComponent,
    LabelComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent
  ],
    
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.css',
})
export class ChangepasswordComponent {

  resetForm: FormGroup;

  constructor(private fb: FormBuilder,private authService:AuthService,private router: Router){
    this.resetForm = this.fb.group(
      {
        oldpassword: ['', [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(4)
          // add pattern for strength if you want
        ]],
        password: ['', [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(4)
          // add pattern for strength if you want
        ]],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: this.passwordsMatchValidator
      }
    );
  }

   // group-level validator to compare password & confirmPassword
  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pw = group.get('password')?.value;
    const cpw = group.get('confirmPassword')?.value;
    if (!pw || !cpw) return null;
    return pw === cpw ? null : { passwordsMismatch: true };
  }

  errormessage='';
  successmessage='';
  isSubmitting = false;
  neworganizer="";
  neworganizerclicked=false;

   onSubmit() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }
    const newPassword = this.resetForm.value.password;
    console.log({'this.resetForm.value':this.resetForm.value});
    // call API: /auth/reset-password with token + newPassword
    this.isSubmitting = true;
    this.authService.postChangePassword({oldPassword:this.resetForm.value.oldpassword,newPassword:this.resetForm.value.password,confirmPassword:this.resetForm.value.confirmPassword}).subscribe({
      next:(response)=>{
        this.isSubmitting = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.successmessage='Password reset successfull.';
        setTimeout(() => {
          this.successmessage='';
          this.router.navigate(['/dashboard']);
        }, 3000);
      },
      error:(err)=>{
        this.isSubmitting = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.errormessage='Password reset failed.';
        setTimeout(() => {
          this.errormessage='';
        }, 3000);
      }
    });
  }

  clearFields(){
    this.resetForm.reset();
  }
  
}
