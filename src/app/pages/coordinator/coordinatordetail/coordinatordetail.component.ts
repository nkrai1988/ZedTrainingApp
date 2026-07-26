

import { Component, OnDestroy } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { DatePickerComponent } from '../../../shared/components/form/date-picker/date-picker.component';
import { TimePickerComponent } from '../../../shared/components/form/time-picker/time-picker.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { CommonModule } from '@angular/common';
import { FormBuilder,FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HelperService } from '../../../services/helper.service';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CoordinatorService } from '../../../services/coordinator.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-coordinatordetail',
  imports: [
    ComponentCardComponent,
    LabelComponent,
    InputFieldComponent,
    SelectComponent,
    DatePickerComponent,
    TimePickerComponent,
    ButtonComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AlertComponent
],
  templateUrl: './coordinatordetail.component.html',
  styles: ``
})
export class CoordinatordetailComponent implements OnDestroy {

  constructor(private fb: FormBuilder,private helperService:HelperService,private coordinatorservice:CoordinatorService,private router: Router,private route:ActivatedRoute){

  }
  detailForm!: FormGroup;
  showPassword = false;
  programmetypeOptions:any=[];
  stateOptions:any=[];
  districtOptions:any=[];
  errormessage='';
  successmessage='';
  isdisable:boolean=true;
  isSubmitting = false;

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
  private subscription: Subscription = new Subscription();

  ngOnInit() {
    this.createForm();
    this.loadDropdowns();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.getAgencyDetail(this.id);
      }
    });
    this.subscription.add(
      this.helperService.category$.subscribe(val => {
        this.detailForm.controls['OrgCategoryId'].setValue(val);
      })
    );
    this.subscription.add(
      this.helperService.subCategory$.subscribe(val => {
        this.detailForm.controls['OrgSubCategoryId'].setValue(val);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  
 
  createForm(){
     this.detailForm = this.fb.group({
      id: [0],
      FirstName: ['', [Validators.required]],
      OrganizationName: ['Self', [Validators.required]],
      address: [''],
      StateName: ['', [Validators.required]],
      districtname: ['', [Validators.required]],
      PinCode: ['', [Validators.required,Validators.minLength(6)]],
      phoneno: ['', [Validators.required,Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required,,Validators.email]],
      AdhaarNo: ['', [Validators.pattern(/^\d{12}$/)]],
      OrgCategoryId: [null],
      OrgSubCategoryId: [null],
    });
  }
  get f() { return this.detailForm.controls; }
  clearForm(){
    this.detailForm.reset()
  }

  loadDropdowns(){
   // this.loadProgrammeType();
    this.loadStates();
  }

  loadProgrammeType(){
    let programmeTypes= this.helperService.getUserTraingProgrammes();
    console.log({'programmeTypes':programmeTypes});
    programmeTypes.forEach((element:any) => {
      this.programmetypeOptions.push({value:element,label:element});
    });
  }

  getAgencyDetail(userid:any){
    this.coordinatorservice.getAgencyDetail(userid).subscribe({
      next:(response:any[]) =>{
        console.log({'detailresponse':response});
        this.stuffValue(response[0]);
      },
      error:(error) =>{
        console.log({'error':error});
      }
    });
  }
stuffValue(values:any){
    console.log({'values':values});
    this.detailForm.patchValue(values);
    this.detailForm.controls['id'].setValue(values.id);
    this.detailForm.controls['FirstName'].setValue(values.firstName);
    this.detailForm.controls['FirstName'].disable();   
   this.detailForm.controls['address'].setValue(values.address);
    this.detailForm.controls['StateName'].setValue(values.stateName);
    this.selectedStateOption=values.stateName;
    this.detailForm.controls['districtname'].setValue(values.districtname);
    this.selectedDistrictOption=values.districtname;
    this.loadDistrictByStates(this.selectedStateOption);
    this.detailForm.controls['PinCode'].setValue(values.pinCode);
    this.detailForm.controls['ProgrammeType'].setValue(values.programmeType);
    this.detailForm.controls['ProgrammeType'].disable();
    this.selectedProgrammetypeOption=values.programmeType;

    this.detailForm.controls['LastName'].setValue(values.lastName);
    if(values.spocName){
      this.detailForm.controls['LastName'].setValue(values.spocName);
    }
    this.detailForm.controls['phoneno'].setValue(values.phoneno);
    this.detailForm.controls['email'].setValue(values.email);
    this.detailForm.controls['email'].disable();
    this.detailForm.controls['AdhaarNo'].setValue(values.adhaarNo);
    this.detailForm.controls['PanNo'].setValue(values.panNo);
    this.detailForm.controls['GstNo'].setValue(values.gstNo);
  }
  

  loadStates(){
    this.stateOptions=[];
    this.helperService.getAllStates().subscribe({
        next:(response:any)=>{
          console.log({'response state':response});          
          response.forEach((element:any) => {
            this.stateOptions.push({value:element.stateID,label: element.stateName});
          });
         
        },
        error: (error:any) => {console.error('Error:', error)
        //this.errormessage='Login failed. Please try again';//error.message;
        
      }
    });
  }

  loadDistrictByStates(stateId:string){
    this.districtOptions=[];
    this.helperService.getDistrictByStates(stateId).subscribe({
        next:(response:any)=>{
          console.log({'response district':response});
          response.forEach((element:any) => {
            this.districtOptions.push({value:element.districtID,label: element.districtname});
          });
        },
        error: (error:any) => {console.error('Error:', error)
        //this.errormessage='Login failed. Please try again';//error.message;
        
      }
    });
  }

  cancelUpdate(){
this.router.navigate(['/agencies']);
  }

  onUpdate(){
    this.detailForm.markAllAsTouched();
    this.detailForm.controls['email'].enable();
    console.log({'this.detailForm':this.detailForm.value});

    if (this.detailForm.invalid) return;
    if (this.detailForm.valid) {
      this.isSubmitting = true;
       this.coordinatorservice.editAgency(this.detailForm.value).subscribe({
      next: (response:any) => {
        this.isSubmitting = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.successmessage ="Coordinator Updated successfully."
      setTimeout(() => {
        this.successmessage ='';
        this.errormessage='';
      this.router.navigate(['/agencies']);
      }, 3000);
      },
      error: (error:any) => {
        this.isSubmitting = false;
        console.error('Error:', error)
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.errormessage='Coordinator Update failed. '+error.error;
        setTimeout(() => {
          this.errormessage='';
        }, 3000);
      }
    });
    }
  }

  onSubmit(){
    this.detailForm.markAllAsTouched();
    console.log({'this.detailForm':this.detailForm});
    if (this.detailForm.invalid) return;
    if (this.detailForm.valid) {
      this.isSubmitting = true;
       this.coordinatorservice.postAgency(this.detailForm.value).subscribe({
      next: (response:any) => {
        this.isSubmitting = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.successmessage ="Coordinator created successfully."
      setTimeout(() => {
        this.successmessage ='';
        this.errormessage='';
      this.router.navigate(['/coordinators']);
      }, 3000);
      },
      error: (error:any) => {
        this.isSubmitting = false;
        console.error('Error:', error)
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.errormessage='Coordinator creation failed. '+error.error;
        setTimeout(() => {
          this.errormessage='';
        }, 3000);
      }
    });
    }
  }

  handleProgrammeTypeSelectChange(value: string) {
    this.selectedProgrammetypeOption = value;
    this.detailForm.controls['ProgrammeType'].setValue(this.selectedProgrammetypeOption);
  
  }
  handleSelectChange(value: string) {
    this.selectedStateOption = value;
    this.detailForm.controls['StateName'].setValue(value);
  }

  handleDistrictSelectChange(value: string) {
    this.selectedDistrictOption = value;
    this.detailForm.controls['districtname'].setValue(value);
    
    
  }

  handleStateSelectChange(value: string) {
    this.selectedStateOption = value;
    this.detailForm.controls['StateName'].setValue(this.selectedStateOption);    
    this.loadDistrictByStates(value)
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


