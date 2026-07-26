// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-newprogramme',
//   imports: [],
//   templateUrl: './newprogramme.component.html',
//   styleUrl: './newprogramme.component.css',
// })
// export class NewprogrammeComponent {

// }
import { Component, OnDestroy } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { RadioComponent } from '../../../shared/components/form/input/radio.component';
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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-newprogramme',
  imports: [
    ComponentCardComponent,
    LabelComponent,
    SelectComponent,
    RadioComponent,
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
export class NewprogrammeComponent implements OnDestroy {

  constructor(private fb: FormBuilder,private helperService:HelperService,private programmeService:ProgrammeService,private agencyservice:AgencyService,private router: Router,private route:ActivatedRoute){

  }
  detailForm!: FormGroup;
  showPassword = false;

  programmetypeOptions:any=[];
  stateOptions:any=[];
  districtOptions:any=[];
  corrdinatorsOptions:any=[];
  leadTrainersOptions:any=[];
  errormessage='';
  successmessage='';
  isSubmitting = false;
  isdisable:boolean=true;

  paidOrFreeOptions = [
    { value: 'Paid', label: 'Paid' },
    { value: 'Free', label: 'Free' },
  ];

selectedOption = '';
  selectedStateOption = '';
  selectedDistrictOption='';
  selectedProgrammetypeOption='';
  selectedPaidOrFree='';
  selectedModeOfProgramme='Virtual';
  selectedCorrdinator='';
  selectedLeadTrainer='';
  coordinatorSearch='';
  dateValue: any;
  timeValue = '';
  id='';
  private subscription: Subscription = new Subscription();
  private currentCategoryId: number | null = null;
  private currentSubCategoryId: number | null = null;

  get filteredCoordinatorOptions(): any[] {
    if (!this.coordinatorSearch) return [];
    const q = this.coordinatorSearch.toLowerCase();
    return this.corrdinatorsOptions.filter((o:any) =>
      o.label.toLowerCase().includes(q) || (o.location && o.location.toLowerCase().includes(q))
    );
  }

  
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
        this.currentCategoryId = val;
        this.detailForm.controls['orgCategory'].setValue(val);
        this.detailForm.controls['OrgCategoryId'].setValue(val);
      })
    );
    this.subscription.add(
      this.helperService.subCategory$.subscribe(val => {
        this.currentSubCategoryId = val;
        this.detailForm.controls['OrgSubCategoryId'].setValue(val);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  
 
  createForm(){
     this.detailForm = this.fb.group({
      BatchNo:['new', [Validators.required]],
      ProgrammeType: ['', [Validators.required]],
      PaidOrFree: ['', [Validators.required]],
      ModeOfProgramme: ['Virtual', [Validators.required]],
      StartDate: ['', [Validators.required]],
      StartTime: ['', [Validators.required]],
      EndDate: ['', [Validators.required]],
      EndTime: ['', [Validators.required]],
      Venue: [''],
      WebLink: ['', [Validators.required]],
      StateName: [''],
      districtname: [''],
      PinCode: [''],
      Coordinator: ['', [Validators.required]],
      LeadTrainer: [''],
      OrganisingPartner: [''],
      orgCategory: [null],
      OrgCategoryId: [null],
      OrgSubCategoryId: [null],
    });
  }
  get f() { return this.detailForm.controls; }
  clearForm(){
    this.detailForm.reset({
      BatchNo: 'new',
      orgCategory: this.currentCategoryId,
      OrgCategoryId: this.currentCategoryId,
      OrgSubCategoryId: this.currentSubCategoryId,
    });
    this.selectedProgrammetypeOption = '';
    this.selectedPaidOrFree = '';
    this.selectedModeOfProgramme = '';
    this.selectedStateOption = '';
    this.selectedDistrictOption = '';
    this.selectedCorrdinator = '';
    this.selectedLeadTrainer = '';
    this.coordinatorSearch = '';
    this.districtOptions = [];
  }

  loadDropdowns(){
    this.loadProgrammeType();
    this.loadStates();
    this.getCoordinators();
    this.getLeadTrainers();
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
        this.corrdinatorsOptions = response.map((element:any) => ({
          value: element.userID,
          label: element.firstName,
          location: [element.districtname, element.stateName].filter(Boolean).join(', ')
        }));
      },
      error:(error) =>{
        console.log({'error':error});
      }
    });
  }

  selectCoordinator(option: any) {
    this.selectedCorrdinator = option.value;
    this.detailForm.controls['Coordinator'].setValue(option.value);
    this.coordinatorSearch = '';
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
    console.log({'this.detailForm':this.detailForm.value});

    if (this.detailForm.invalid) return;
    if (this.detailForm.valid) {
      this.isSubmitting = true;
       this.programmeService.postNewProgramme(this.detailForm.value).subscribe({
      next: (response:any) => {
        this.isSubmitting = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.successmessage ="New Programme created successfully."
      setTimeout(() => {
        this.successmessage ='';
        this.errormessage='';
      this.router.navigate(['/programme']);
      }, 3000);
      },
      error: (error:any) => {
        this.isSubmitting = false;
        console.error('Error:', error)
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.errormessage='Programme creation failed. '+error.error;
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

  handlePaidOrFreeSelectChange(value: string) {
    this.selectedPaidOrFree = value;
    this.detailForm.controls['PaidOrFree'].setValue(value);
  }

  handleModeOfProgrammeSelectChange(value: string) {
    this.selectedModeOfProgramme = value;
    this.detailForm.controls['ModeOfProgramme'].setValue(value);

    const webLink  = this.detailForm.controls['WebLink'];
    const venue    = this.detailForm.controls['Venue'];
    const state    = this.detailForm.controls['StateName'];
    const district = this.detailForm.controls['districtname'];
    const pin      = this.detailForm.controls['PinCode'];

    if (value === 'Virtual') {
      webLink.setValidators([Validators.required]);
      venue.clearValidators();
      state.clearValidators();
      district.clearValidators();
      pin.clearValidators();
    } else {
      webLink.clearValidators();
      venue.setValidators([Validators.required]);
      state.setValidators([Validators.required]);
      district.setValidators([Validators.required]);
      pin.setValidators([Validators.required, Validators.minLength(6)]);
    }

    [webLink, venue, state, district, pin].forEach(c => {
      c.reset();
      c.updateValueAndValidity();
    });

    this.selectedStateOption = '';
    this.selectedDistrictOption = '';
    this.districtOptions = [];
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


