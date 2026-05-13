// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-newfaculty',
//   imports: [],
//   templateUrl: './newfaculty.component.html',
//   styleUrl: './newfaculty.component.css',
// })
// export class NewfacultyComponent {

// }


import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { CommonModule } from '@angular/common';
import { FormBuilder,FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HelperService } from '../../../services/helper.service';

import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CoordinatorService } from '../../../services/coordinator.service';
import { FileInputComponent } from '../../../shared/components/form/input/file-input.component';
import { RadioComponent } from '../../../shared/components/form/input/radio.component';
import { FacultyService } from '../../../services/faculty.service';

@Component({
  selector: 'app-newfaculty',
  imports: [
    ComponentCardComponent,
    LabelComponent,
    ButtonComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AlertComponent,
    FileInputComponent,
    RadioComponent
],
  templateUrl: './newfaculty.component.html',
  styles: ``
})
export class NewfacultyComponent {

  constructor(private fb: FormBuilder,private helperService:HelperService,private service:FacultyService,private router: Router,private route:ActivatedRoute){

  }
  detailForm!: FormGroup;
  showPassword = false;
  programmetypeOptions:any=[];
  stateOptions:any=[];
  districtOptions:any=[];
  errormessage='';
  successmessage='';
  isdisable:boolean=true;

  options = [
    { value: 'marketing', label: 'Marketing' },
    { value: 'template', label: 'Template' },
    { value: 'development', label: 'Development' },
  ];


  selectedOption = '';
  selectedStateOption = '';
  selectedDistrictOption='';
  selectedProgrammetypeOption='';
  dateValue: any;
  timeValue = '';
  cardNumber = '';
  id='';
checkedValue='';
resumefile:any;

  
  ngOnInit() {  
    this.createForm();    
    // this.route.params.subscribe(params => {      
    //   if(params['id']){
    //      this.id = params['id'];
    //      this.getAgencyDetail(this.id);
    //   }
    // });  
    
  }

  
 
  createForm(){
     this.detailForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required]],
      engagement: ['', [Validators.required]],
      qualification: [''],
      experience: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneno: ['', [Validators.required,Validators.pattern(/^\d{10}$/)]],      
      adhaarNo: ['', [Validators.pattern(/^\d{12}$/)]],
      //resume: [''],
    });
  }

  get f() { return this.detailForm.controls; }

  clearForm(){
    this.detailForm.reset()
  }

  

  handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.resumefile=file;      
      console.log('Selected file:', file.name);
     // this.detailForm.controls['resume'].setValue(file);
    }
  }

  

  

cancelUpdate(){
     this.router.navigate(['/zedfaculty']);
}

  

  handleRadioChange(value: string) {
    this.checkedValue = value;
    this.detailForm.controls['engagement'].setValue(value);
    
  }

  onSubmit(){
    this.detailForm.markAllAsTouched();
    if (this.detailForm.invalid) return;

    this.service.postFaculty(this.detailForm.value, this.resumefile).subscribe({
      next: (response: any) => {
        this.successmessage = "Faculty created successfully.";
        setTimeout(() => {
          this.successmessage = '';
          this.errormessage = '';
          this.router.navigate(['/zedfaculty']);
        }, 3000);
      },
      error: (error: any) => {
        console.error('Error:', error);
        this.errormessage = 'Faculty creation failed. ' + error.error;
        setTimeout(() => {
          this.errormessage = '';
        }, 3000);
      }
    });
  }


  

  handleDateChange(event: any) {
    this.dateValue = event;    
  }

  handleTimeChange(event: any) {
    this.timeValue = event.target.value;    
  }

  onTimeSelected(time: string) {
    console.log('Picked time:', time); // e.g. "10:45"
  }
}


