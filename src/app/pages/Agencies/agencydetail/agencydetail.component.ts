 import { Component, OnDestroy, OnInit } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { CommonModule } from '@angular/common';
import { FormBuilder,FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HelperService } from '../../../services/helper.service';
import { AgencyService } from '../../../services/agencies.service';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-agencydetail',
  imports: [
    ComponentCardComponent,
    LabelComponent,
    SelectComponent,
    ButtonComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AlertComponent
],
  templateUrl: './agencydetail.component.html',
  styles: ``
})
export class AgencydetailComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,private helperService:HelperService,private agencyservice:AgencyService,private router: Router,private route:ActivatedRoute){

  }
  detailForm!: FormGroup;
  showPassword = false;
  programmetypeOptions:any=[];
  stateOptions:any=[];
  districtOptions:any=[];
  errormessage='';
  successmessage='';
  isSubmitting = false;
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
private subscription: Subscription = new Subscription();
  
  ngOnInit() {  
    this.createForm();
    this.loadDropdowns();
    this.route.params.subscribe(params => {      
      if(params['id']){
         this.id = params['id'];
         this.getAgencyDetail(this.id);
      }
    });
    
    if (this.helperService.IsMasterAdmin()) {
      this.subscription = this.helperService.category$.subscribe(val => {
        console.log({'this.Category': val});
        this.detailForm.controls['OrgCategory'].setValue(val);
      });
    }
    else{
      this.detailForm.controls['OrgCategory'].setValue(this.helperService.getOrgCategory());
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  
 
  createForm(){
     this.detailForm = this.fb.group({
      id: [0],
      FirstName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      StateName: ['', [Validators.required]],
      districtname: ['', [Validators.required]],
      PinCode: ['', [Validators.required,Validators.minLength(6)]],
      ProgrammeType: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      phoneno: ['', [Validators.required,Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required,,Validators.email]],
      AdhaarNo: ['', [Validators.pattern(/^\d{12}$/)]],
      PanNo: ['', [Validators.required,Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)]],
      GstNo: ['', [Validators.pattern(/^\d{15}$/)]],
      OrgCategory: ['', [Validators.required]],
    });
  }
  get f() { return this.detailForm.controls; }
  clearForm(){
    this.detailForm.reset()
  }

  loadDropdowns(){
    this.loadProgrammeType();
    this.loadStates();
  }

  loadProgrammeType(){
    let programmeTypes= this.helperService.getUserTraingProgrammes();
    
    programmeTypes.forEach((element:any) => {
      this.programmetypeOptions.push({value:element,label:element});
    });
  }

  getAgencyDetail(userid:any){
    this.agencyservice.getAgencyDetail(userid).subscribe({
      next:(response:any[]) =>{
        
        this.stuffValue(response[0]);
      },
      error:(error) =>{
        console.log({'error':error});
      }
    });
  }
stuffValue(values:any){
    
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
    if (this.detailForm.invalid) return;
    if (this.detailForm.valid) {
      this.isSubmitting = true;
       this.agencyservice.editAgency(this.detailForm.value).subscribe({
      next: (response:any) => {
        this.isSubmitting = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.successmessage ="Agency Updated successfully."
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
        this.errormessage='Agency Update failed. '+error.error;
        setTimeout(() => {
          this.errormessage='';
        }, 3000);
      }
    });
    }
  }

  onSubmit(){
    this.detailForm.markAllAsTouched();
    if (this.detailForm.invalid) return;
    if (this.detailForm.valid) {
      this.isSubmitting = true;
       this.agencyservice.postAgency(this.detailForm.value).subscribe({
      next: (response:any) => {
        this.isSubmitting = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.successmessage ="Agency created successfully."
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
        this.errormessage='Agency creation failed. '+error.error;
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

