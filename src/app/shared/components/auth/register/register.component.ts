// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-register',
//   imports: [],
//   templateUrl: './register.component.html',
//   styleUrl: './register.component.css',
// })
// export class RegisterComponent {

// }


import { Component, EventEmitter, Output } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../ui/button/button.component';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../ui/alert/alert.component';
import { ComponentCardComponent } from '../../common/component-card/component-card.component';
import { RadioButtonsComponent } from '../../form/form-elements/radio-buttons/radio-buttons.component';
import { RadioComponent } from '../../form/input/radio.component';
import { AuthService } from '../../../../services/auth.service';


@Component({
  selector: 'app-register',
  imports: [
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AlertComponent,
    ComponentCardComponent,
    RadioComponent
],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {

  constructor(private fb: FormBuilder,private authService:AuthService,private router: Router) {}

  showPassword = false;
  isChecked = false;

  fname = '';
  lname = '';
  email = '';
  password = '';
  checkedValue='';
  checkInForm!: FormGroup;
  errormessage='';

  @Output() onUserCheck = new EventEmitter<any>();
  
  ngOnInit() {
    //this.errormessage='';
    this.checkInForm = this.fb.group({
      email: ['', [Validators.required,,Validators.email]],
      mobile: ['', [Validators.required,Validators.pattern(/^\d{10}$/)]],      
      applyfor: ['', [Validators.required]]
    });
  }

  get f() { return this.checkInForm.controls; }

  onLogInCheck() {
    console.log({'data':this.checkInForm.value});
    this.checkInForm.markAllAsTouched(); 
    if (this.checkInForm.invalid) return;
    //return true;
    
    if (this.checkInForm.valid) {    
      
       this.authService.postUserCheck(this.checkInForm.value).subscribe({
      next: (response:any) => { 
        console.log({response:response});
     // this.router.navigate(['/dashboard']); //this.router.navigate(['/dashboard']); 
       this.onUserCheck.emit(this.checkInForm.value);
      },
      error: (error) => {
        console.error('Error:', error)
        this.errormessage=(error.error)? error.error :'Login failed. Please try again';//error.message;
        setTimeout(() => {
        this.errormessage='';
      //this.router.navigate(['/zedfaculty']);
      }, 3000);
      }
    });
    } 
    
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  handleRadioChange(value:any){
    this.checkedValue=value;
    this.checkInForm.controls['applyfor'].setValue(value);
  }

  onSignIn() {
    console.log('First Name:', this.fname);
    console.log('Last Name:', this.lname);
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    console.log('Remember Me:', this.isChecked);
  }
}
