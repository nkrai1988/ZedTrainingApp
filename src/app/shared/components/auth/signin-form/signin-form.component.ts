
import { Component, inject } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../ui/alert/alert.component';
import { AuthService } from '../../../../services/auth.service';
import { HelperService } from '../../../../services/helper.service';


@Component({
  selector: 'app-signin-form',
  imports: [
    LabelComponent,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AlertComponent,
],
  templateUrl: './signin-form.component.html',
  styles: ``
})
export class SigninFormComponent {



  showPassword = false;
  isChecked = false;

  email = '';
  password = '';
  btntext='Sign in';

  signinForm!: FormGroup;
  submitted = false;
  invalidUserName=false;
  invalidPassword=false;
  errormessage='';

  constructor(private fb: FormBuilder,private authService:AuthService,private router: Router) {}
private helperService = inject(HelperService);
  ngOnInit() {
    this.errormessage='';
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
    
    if (this.signinForm.invalid) return;
    //return true;
    this.submitted = true;
    if (this.signinForm.valid) {    
      // Call your ApiService here
      this.btntext='Processing...';
       this.authService.postLoginData(this.signinForm.value).subscribe({
      next: (response:any) => {
        this.helperService.storeLoginData(response);
        if(this.helperService.IsAgency()){
         this.router.navigate(['/coordinators']);
        }
        else if(this.helperService.IsCoordinator()){
         this.router.navigate(['/programme']);
        }
        else if(this.helperService.IsCategoryAdmin()){
         this.router.navigate(['/categoryadmindashboard']);
        }
        else{
          this.router.navigate(['/dashboard']);
        }
        
      // Redirect
      // if(this.helperService.IsSuperAdmin()){
      //     this.helperService.setPortal('training');
      //    this.router.navigate(['/dashboard']); //this.router.navigate(['/dashboard']); 
      // }
      // if(this.helperService.IsAssessor()){
      //     this.helperService.setPortal('assessor');
      //    this.router.navigate(['/assessordashboard']); //this.router.navigate(['/dashboard']); 
      // }
      
      },
      error: (error) => {console.error('Error:', error)
        this.btntext='Sign in'
        this.errormessage=(error.error)? error.error :'Login failed. Please try again';//error.message;
        
      }
    });
    } 
    
  }
}
