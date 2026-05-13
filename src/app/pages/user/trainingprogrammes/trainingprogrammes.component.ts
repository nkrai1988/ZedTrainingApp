// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-trainingprogrammes',
//   imports: [],
//   templateUrl: './trainingprogrammes.component.html',
//   styleUrl: './trainingprogrammes.component.css',
// })
// export class TrainingprogrammesComponent {

// }

import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { BasicTableTwoComponent } from '../../../shared/components/tables/basic-tables/basic-table-two/basic-table-two.component';
import { AgencyService } from '../../../services/agencies.service';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { AvatarTextComponent } from '../../../shared/components/ui/avatar/avatar-text.component';
import { CheckboxComponent } from '../../../shared/components/form/input/checkbox.component';

import { RadioComponent } from '../../../shared/components/form/input/radio.component';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { ModalService } from '../../../shared/services/modal.service';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { RouterModule } from '@angular/router';
import { ProgrammeService } from '../../../services/programme.service';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { DatePickerComponent } from '../../../shared/components/form/date-picker/date-picker.component';
import { HelperService } from '../../../services/helper.service';

@Component({
  selector: 'app-trainingprogrammes',
  imports: [
    ComponentCardComponent,
    BadgeComponent,
    AvatarTextComponent,
    CheckboxComponent,
    FormsModule,
    RadioComponent,
    SelectComponent,
    CommonModule,
    AlertComponent,
    ModalComponent,
    LabelComponent,
    InputFieldComponent,
    ButtonComponent,
    RouterModule,
    DatePickerComponent
    
  ],
  templateUrl: './trainingprogrammes.component.html',
  styleUrl: './trainingprogrammes.component.css',
})
export class TrainingprogrammesComponent {
  constructor(private fb: FormBuilder,private programmeservice:ProgrammeService,public modal: ModalService,private helperService:HelperService){
      
    }

    filterForm!: FormGroup;
    checkInForm!: FormGroup;

    options = [
    { value: 'marketing', label: 'Marketing' },
    { value: 'template', label: 'Template' },
    { value: 'development', label: 'Development' },
  ];
  stateOptions:any=[];
  statusOptions:any=[];
  selectedOptionforState = '';
  selectedOptionforStatus = '';
  dateValue: any;
  datePickerdefaultDate=true;
  registrationEmail='';
  registrationMobile='';


  

handleStateSelectChange(value: string) {
    this.selectedOptionforState = value;
    console.log('Selected value:', value);
    this.filterForm.controls['StateName'].setValue(value)
}

handleStatusSelectChange(value: string) {
    this.selectedOptionforStatus = value;
    console.log('Selected value:', value);
    this.filterForm.controls['Status'].setValue(value)
}

  handleStartDateChange(event: any) {
    this.dateValue = event;
    console.log('Date changed:', event);
    let dtstr = event.dateStr.split('-');
    console.log(dtstr);
    this.filterForm.controls['StartDate'].setValue((dtstr[2]+dtstr[0]+dtstr[1]));//yymmdd
  }

  handleEndDateChange(event: any) {
    this.dateValue = event;
    console.log('Date changed:', event);
    let dtstr = event.dateStr.split('-');
    this.filterForm.controls['EndDate'].setValue((dtstr[2]+dtstr[0]+dtstr[1]));//yymmdd
  }
  
    isOpen = false;
    modelItem:any;
  openModal(row:any) {
    this.modelItem=row;
    console.log({'modelItem':this.modelItem});
     this.isOpen = true;
     }
  closeModal() { 
    this.modelItem=null;
    this.isOpen = false; 
  }
    dataRow:any=[];
    programmeList:any=[];
    successmessage='';
    ngOnInit(){
      this.createForm();
      this.loadStatus();
      this.getProgrammes();
      this.loadStates();
      
    }

    getRegister(row:any){
      this.openModal(row);
  }

    createForm(){
     this.filterForm = this.fb.group({      
      StateName: ['', [Validators.required]],
      Status: ['', [Validators.required]],      
      StartDate: ['', [Validators.required]],
      EndDate: ['', [Validators.required]]      
    });

    this.checkInForm = this.fb.group({
      email: ['', [Validators.required,,Validators.email]],
      mobile: ['', [Validators.required,Validators.pattern(/^\d{10}$/)]],
    });
  }
  get f() { return this.filterForm.controls; }

  clearForm(){
    this.filterForm.reset()
    this.dataRow = this.programmeList;
    this.selectedOptionforState='';
    this.selectedOptionforStatus='';
    this.datePickerdefaultDate = false;
    setTimeout(() => {
      this.datePickerdefaultDate=true;
    }, 10);
  }

  onFilterSubmit(){
    
    let tempListData= this.programmeList;    
    if(this.filterForm.value.StateName){
     tempListData = tempListData.filter((p:any)=> p.state == this.filterForm.value.StateName);     
    }    
    if(this.filterForm.value.Status){
     tempListData = tempListData.filter((p:any)=> p.status == this.filterForm.value.Status);
    }
    if(this.filterForm.value.StartDate &&  this.filterForm.value.EndDate){
      tempListData = tempListData.filter((p:any)=> (p.strStartDateFilter == this.filterForm.value.StartDate && p.strEndDateFilter == this.filterForm.value.EndDate));
    }
    this.dataRow = tempListData;
    
  }

  handleSave(row:any) {    
    
    
    if(!this.registrationEmail || !this.registrationMobile){
        return;
    } 
    let data= {batchNo:row.batchNo,email:this.registrationEmail,mobile:this.registrationMobile};
    this.programmeservice.registerAssessorsToBatch(data).subscribe({
      next:(res:any)=>{
          this.modal.closeModal();   
          this.successmessage='You have successfully enrolled in the Programme.';
          setTimeout(() => {
            this.successmessage=''; 
          }, 400);
      },
      error:(err:any)=>{

      }
    });
  }

  getProgrammes(){
    this.programmeservice.getTrainingProgrammeList().subscribe({
      next:(response:any[])=>{
             
        this.dataRow = response;
        this.programmeList=response;
      }
    });    
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

  loadStatus(){
    this.statusOptions=this.helperService.getProgrammeStatus();
    
  }

  
  

  

  selectedRows: string[] = [];
  selectAll: boolean = false;

  

  handleRowSelect(id: string) {
    if (this.selectedRows.includes(id)) {
      this.selectedRows = this.selectedRows.filter(rowId => rowId !== id);
    } else {
      this.selectedRows = [...this.selectedRows, id];
    }
  }

  

  getStatusBadgeColor(type: string): 'success' | 'warning' | 'error'|'info' {
   
    if (type === '1' || type === '3') return 'success';
    if (type === '0') return 'info';
    if (type === '2' || type === '6' || type === '11' || type === '12') return 'warning';
    if (type === '4' || type === '5' || type === '7') return 'error';
    return 'error';
  }


  selectedValue: string = 'option2';
  checkedValue: string = 'Blocked';

  handleRadioChange(value: string) {
    this.checkedValue = value;
    this.dataRow=[];
   // this.getAgencies();
  }
  

  getStatusString(status:any){
    //return 'Permission Pending';
  let statusString='';
      switch (status) {
  case '0':
    statusString='Permission Pending';
    break;
  case '1':
    statusString='Permission Accepted';
    break;
    case '2':
    statusString='QC Pending';
    break;
    case '3':
    statusString='QC Approved';
    break;
    case '4':
    statusString='Permission Rejected';
    break;
    case '5':
    statusString='QC Rejected';
    break;
    case '6':
    statusString='QC Pending';
    break;
    case '7':
    statusString='Postponed';
    break;
    case '11':
    statusString='Calendar Created';
    break;
    case '12':
    statusString='Calendar Created';
    break;
  default:
    statusString='--';
    break;

     
}
return statusString;
  }

  changeUserStatus(user:any){ 
    // let confirmText = user.isActive ? 'Block this user and prevent future access?': 'Un Block this user?'
    // if(confirm(confirmText)){
    //   this.agencyservice.putAuditorStatus(user).subscribe({
    //   next:(response:any)=>{        
    //    let row = this.dataRow.filter((f:any) => f.id==response.id);       
    //    this.dataRow = this.dataRow.filter((f:any) => f.id != response.id);
    //   this.successmessage=user.isActive ? 'User account blocked successfully.': 'User account unblocked successfully.';
    //   setTimeout(() => {
    //     this.successmessage='';
    //   }, 5000);

    //   }
    // });    
    // }
  }

}

