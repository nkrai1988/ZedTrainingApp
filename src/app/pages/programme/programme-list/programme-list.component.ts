import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
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
import { DataloadinprogressComponent } from '../../../shared/components/common/dataloadinprogress/dataloadinprogress.component';
import { DatanotfoundComponent } from '../../../shared/components/common/datanotfound/datanotfound.component';
import { TextAreaComponent } from '../../../shared/components/form/input/text-area.component';

@Component({
  selector: 'app-programme-list',
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
    DatePickerComponent,
    DataloadinprogressComponent,
    DatanotfoundComponent,
    TextAreaComponent
  ],
  templateUrl: './programme-list.component.html',
  styleUrl: './programme-list.component.css',
})
export class ProgrammeListComponent implements OnInit, OnDestroy {
  constructor(private fb: FormBuilder,private programmeservice:ProgrammeService,public modal: ModalService,public helperService:HelperService){

    }
  private currentCategoryId: number | null = null;
  private currentSubCategoryId: number | null = null;
  private subscription: Subscription = new Subscription();

    filterForm!: FormGroup;
    dataLoadProgress=false;
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
  
  comment='';
  commenthind='';
  commenterror=false;
    isOpen = false;
    modelItem:any;
  openModal(row:any) {
    this.modelItem=row;
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
      this.loadStates();
      this.subscription.add(
        combineLatest([this.helperService.category$, this.helperService.subCategory$])
          .subscribe(([category, subCategory]) => {
            this.currentCategoryId = category;
            this.currentSubCategoryId = subCategory;
            this.getProgrammesFromServer();
          })
      );
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

    getProgrammesFromServer(){
      if(this.helperService.IsSuperAdmin()){
        this.getAdminProgrammes();
      }
      else{
         this.getProgrammes();
      }
    }

    createForm(){
     this.filterForm = this.fb.group({
      StateName: [''],
      Status: [''],
      StartDate: [''],
      EndDate: ['']
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
    console.log(this.filterForm.value)
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

  handleSave() {  

    if(!this.comment){
      this.commenthind='Comment Required.';
      this.commenterror=true;
      return;
    }

  }

  commentValueChange($event:any){
    this.comment=$event;
    console.log({'$event':$event});
    
  }

  exportExcel(){

    var filters={
      State:this.filterForm.value.StateName,
      Status:this.filterForm.value.Status,
      StartDate:this.filterForm.value.StartDate,
      EndDate:this.filterForm.value.EndDate,
    }

    console.log({'filters':filters});
    
    this.programmeservice.programmeexportToExcel(filters).subscribe({
      next:(response : any)=>{     
        console.log({'response':response});
        const blob = response.body as Blob;
        let fileName = 'report.xlsx';
      const contentDisposition = response.headers.get('Content-Disposition');

      if (contentDisposition) {
        const match = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (match && match[1]) {
          fileName = match[1].replace(/['"]/g, '');
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);   
        // const downloadUrl = window.URL.createObjectURL(blob);
        // const link = document.createElement('a');
        // link.href = downloadUrl;
        // link.download = 'Report.xlsx';
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
        // window.URL.revokeObjectURL(downloadUrl);

      },
      error:(err:any)=>{
        console.log({'comp error':err});
        console.log({'comp error':err.error.text});
        console.log(err.error.text instanceof Blob)
          if (err.error.text instanceof Blob) {
      // Reader to convert error blob back to readable JSON
      const reader = new FileReader();
      reader.onload = () => {
        const errorDetails = JSON.parse(reader.result as string);
        console.error(errorDetails);
      };
      reader.readAsText(err.error.text);
    }
      }
    });
  }

  onAccept(row:any){
    if(confirm('Approve this Programme?')){      
      this.programmeservice.approveProgramme(row.id).subscribe({
        next:(res:any)=>{
          this.getProgrammesFromServer();
          this.successmessage="Programme approved successfully.";
          setTimeout(() => {  
            this.successmessage='';
          }, 5000);
        },
        error:(err:any)=>{

        }
      })
    }
  }

  onReject(row:any){
    this.openModal(row);
  }

  onInput(event: Event) {
    const val = (event.target as HTMLTextAreaElement).value;
    console.log({'val':val});
  }

  getProgrammes(){
    this.dataLoadProgress=true;
    let centerId = '';
    if (this.helperService.IsAgency() || this.helperService.IsCoordinator()) {
      centerId = this.helperService.getUserEmail();
    }
    // Category Admin sees all subcategories in their category; Agency/Coordinator filtered to their own subcategory
    const subCategoryFilter = this.helperService.IsCategoryAdmin() ? null : this.currentSubCategoryId;
    this.programmeservice.getProgrammeList(centerId, this.currentCategoryId, subCategoryFilter).subscribe({
      next:(response:any[])=>{
        this.dataRow = response;
        this.programmeList=response;
        this.dataLoadProgress=false;
      },
      error:(err:any)=>{
        this.dataLoadProgress=false;
      }

    });
  }

  getAdminProgrammes(){
    this.dataLoadProgress=true;
    this.programmeservice.getAdminProgrammeList(this.currentCategoryId).subscribe({
      next:(response:any[])=>{
        this.dataRow = response;
        this.programmeList=response;
        this.dataLoadProgress=false;
      },
      error:(err:any)=>{
        this.dataLoadProgress=false;
      }

    });
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

  loadStatus(){
    this.statusOptions=this.helperService.getProgrammeStatus();
    console.log({'this.statusOptions':this.statusOptions});
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

