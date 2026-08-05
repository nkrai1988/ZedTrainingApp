
import { Component, inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../ui/alert/alert.component';
import { AuthService } from '../../../../services/auth.service';
import { HelperService } from '../../../../services/helper.service';
import { RecaptchaEnterpriseService } from '../../../../services/recaptcha-enterprise.service';


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
export class SigninFormComponent implements AfterViewInit {

  @ViewChild('recaptchaContainer') recaptchaContainer!: ElementRef<HTMLDivElement>;

  showPassword = false;
  btntext = 'Sign in';

  signinForm!: FormGroup;
  submitted = false;
  invalidUserName=false;
  invalidPassword=false;
  errormessage='';
  recaptchaToken: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private recaptchaService: RecaptchaEnterpriseService
  ) {}

  private helperService = inject(HelperService);

  ngOnInit() {
    this.errormessage='';
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(64)]],
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

    this.authService.postLoginData(payload).subscribe({
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
      },
      error: (error) => {
        this.btntext = 'Sign in';
        this.recaptchaToken = null;
        this.recaptchaService.reset();
        this.errormessage = (error.error) ? error.error : 'Login failed. Please try again';
      }
    });
  }
}
