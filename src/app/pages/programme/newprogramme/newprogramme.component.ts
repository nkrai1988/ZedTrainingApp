// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-newprogramme',
//   imports: [],
//   templateUrl: './newprogramme.component.html',
//   styleUrl: './newprogramme.component.css',
// })
// export class NewprogrammeComponent {

// }
 import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { DatePickerComponent } from '../../../shared/components/form/date-picker/date-picker.component';
import { TimePickerComponent } from '../../../shared/components/form/time-picker/time-picker.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { CommonModule } from '@angular/common';
import { FormBuilder,FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HelperService } from '../../../services/helper.service';
import { AgencyService } from '../../../services/agencies.service';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgrammeService } from '../../../services/programme.service';

@Component({
  selector: 'app-newprogramme',
  imports: [
    ComponentCardComponent,
    LabelComponent,
    SelectComponent,
    DatePickerComponent,
    TimePickerComponent,
    ButtonComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AlertComponent,
],
  templateUrl: './newprogramme.component.html',
  styles: ``
})
export class NewprogrammeComponent {

  constructor(private fb: FormBuilder,private helperService:HelperService,private programmeService:ProgrammeService,private agencyservice:AgencyService,private router: Router,private route:ActivatedRoute){

  }
  detailForm!: FormGroup;
  showPassword = false;
  
  programmetypeOptions:any=[];
  stateOptions:any=[];
  districtOptions:any=[];
  corrdinatorsOptions:any=[];
  leadTrainersOptions:any=[];
  organisingPartnerOptions:any=[];
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
  selectedCorrdinator='';
  selectedLeadTrainer='';
  selectedOrganisingPartners='';
  dateValue: any;
  timeValue = '';
  cardNumber = '';
  id='';

  
  ngOnInit() {  
    this.createForm();
    this.loadDropdowns();
    this.route.params.subscribe(params => {      
      if(params['id']){
         this.id = params['id'];
         this.getAgencyDetail(this.id);
      }     
      
    });  
    
  }

  
 
  createForm(){
     this.detailForm = this.fb.group({
      BatchNo:['new', [Validators.required]],
      ProgrammeType: ['', [Validators.required]],
      StartDate: ['', [Validators.required]],
      StartTime: ['', [Validators.required]],
      EndDate: ['', [Validators.required]],
      EndTime: ['', [Validators.required]],
      Venue: ['', [Validators.required]],
      WebLink: [''],
      StateName: ['', [Validators.required]],
      districtname: ['', [Validators.required]],
      PinCode: ['', [Validators.required,Validators.minLength(6)]],
      Coordinator: ['', [Validators.required]],
      LeadTrainer: [''],
      OrganisingPartner: ['', [Validators.required]],
      orgCategory: [this.helperService.masterOrgCategory],
    });
  }
  get f() { return this.detailForm.controls; }
  clearForm(){
    this.detailForm.reset();
  }

  loadDropdowns(){
    this.loadProgrammeType();
    this.loadStates();
    this.getCoordinators();
    this.getLeadTrainers();
    this.getOrganisingPartner();
  }

  loadProgrammeType(){
       this.programmeService.getProgrammeOption().subscribe({
        next:(response:any[])=>{  
          this.programmetypeOptions=[];  
          this.programmetypeOptions=response.map(x=> ({value:x.qpCode,label:x.qpName}));
          //this.programmetypeOptions.unshift({value:'All',label:'All'});
        }
    });

    // let programmeTypes= this.helperService.getUserTraingProgrammes();
    // console.log({'programmeTypes':programmeTypes});
    // programmeTypes.forEach((element:any) => {
    //   this.programmetypeOptions.push({value:element,label:element});
    // });
  }

  getCoordinators(){
    this.programmeService.getCoordinatorsList().subscribe({
      next:(response:any[]) =>{
        console.log({'corrdianotrs':response});
        response.forEach((element:any) => {
         this.corrdinatorsOptions.push({value:element.userID,label:element.firstName});
         });
      },
      error:(error) =>{
        console.log({'error':error});
      }
    });
  }

  getLeadTrainers(){
    this.programmeService.getLeadTrainersList().subscribe({
      next:(response:any[]) =>{
        console.log({'leadTrainers':response});
        response.forEach((element:any) => {
         this.leadTrainersOptions.push({value:element.id,label:element.trainerName});
         });
      },
      error:(error) =>{
        console.log({'error':error});
      }
    });
  }

  getOrganisingPartner(){
    this.programmeService.getLeadOrganisingParterList().subscribe({
      next:(response:any[]) =>{
        console.log({'leadTrainers':response});
        response.forEach((element:any) => {
         this.organisingPartnerOptions.push({value:element.organisingPartner,label:element.organisingPartner});
         });
      },
      error:(error) =>{
        console.log({'error':error});
      }
    });
  }

  getAgencyDetail(userid:any){
    this.agencyservice.getAgencyDetail(userid).subscribe({
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
      // Call your ApiService here
       this.agencyservice.editAgency(this.detailForm.value).subscribe({
      next: (response:any) => { 
        this.successmessage ="Agency Updated successfully."
        
      // Redirect
      setTimeout(() => {
        this.successmessage ='';
        this.errormessage='';
      this.router.navigate(['/agencies']);
      }, 3000);
       //this.router.navigate(['/dashboard']); 
      },
      error: (error:any) => {console.error('Error:', error)
        this.errormessage='Agency Update failed. '+error.error;//error.message;
        setTimeout(() => {
          this.errormessage='';
        }, 3000);
      }
    });
    }
  }

  onSubmit(){
    this.detailForm.markAllAsTouched(); 
    console.log({'this.detailForm':this.detailForm.value});
    
    if (this.detailForm.invalid) return;
    if (this.detailForm.valid) {    
      // Call your ApiService here
       this.programmeService.postNewProgramme(this.detailForm.value).subscribe({
      next: (response:any) => { 
        this.successmessage ="New Programme created successfully."
        //this.helperService.storeLoginData(response);      
      // Redirect
      setTimeout(() => {
        this.successmessage ='';
        this.errormessage='';
      this.router.navigate(['/programme']);
      }, 3000);
       //this.router.navigate(['/dashboard']); 
      },
      error: (error:any) => {console.error('Error:', error)
        this.errormessage='Programme creation failed. '+error.error;//error.message;
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

  handleCoordinatorsSelectChange(value: string) {
    this.selectedCorrdinator = value;
    console.log({'this.selectedCorrdinator':this.selectedCorrdinator});
    this.detailForm.controls['Coordinator'].setValue(value);
  }

  handleLeadTrainerSelectChange(value: string) {
    this.selectedLeadTrainer = value;
    console.log({'this.selectedLeadTrainer':this.selectedLeadTrainer});
    this.detailForm.controls['LeadTrainer'].setValue(value);
  }

  handleOrganisingPartnerSelectChange(value: string) {
    this.selectedOrganisingPartners = value;
    console.log({'this.selectedLeadTrainer':this.selectedOrganisingPartners});
    this.detailForm.controls['OrganisingPartner'].setValue(value);
  }

  handleStateSelectChange(value: string) {
    this.selectedStateOption = value;
    this.detailForm.controls['StateName'].setValue(this.selectedStateOption);    
    this.loadDistrictByStates(value)
  }

  handleStartDateChange(event: any) {    
    this.detailForm.controls['StartDate'].setValue(event.dateStr);
  }

  handleStartTime(event: any) {    
    this.detailForm.controls['StartTime'].setValue(event);
  }

  handleEndDateChange(event: any) {    
    this.detailForm.controls['EndDate'].setValue(event.dateStr);
  }

  handleEndTime(event: any) {    
    this.detailForm.controls['EndTime'].setValue(event);
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


