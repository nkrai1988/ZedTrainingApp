// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-trainerlist',
//   imports: [],
//   templateUrl: './trainerlist.component.html',
//   styleUrl: './trainerlist.component.css',
// })
// export class TrainerlistComponent {

// }

// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-zedfaculty',
//   imports: [],
//   templateUrl: './zedfaculty.component.html',
//   styleUrl: './zedfaculty.component.css',
// })
// export class ZedfacultyComponent {

// }


import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';

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
import { Router, RouterModule } from '@angular/router';
import { ProgrammeService } from '../../../services/programme.service';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { DatePickerComponent } from '../../../shared/components/form/date-picker/date-picker.component';
import { HelperService } from '../../../services/helper.service';
import { FacultyService } from '../../../services/faculty.service';
import { DataloadinprogressComponent } from '../../../shared/components/common/dataloadinprogress/dataloadinprogress.component';
import { DatanotfoundComponent } from '../../../shared/components/common/datanotfound/datanotfound.component';

@Component({
  selector: 'app-trainerlist',
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
    DatanotfoundComponent
    
  ],
  templateUrl: './trainerlist.component.html',
  styleUrl: './trainerlist.component.css',
})
export class TrainerlistComponent {
  constructor(private fb: FormBuilder,private facultyservice:FacultyService,public modal: ModalService,private helperService:HelperService,private router: Router){
      
    }

  dataLoadProgress=false;
  filterForm!: FormGroup;  
  agenciesOptions:any=[];
  programmetypeOptions:any=[];
  selectedOptionagency = '';
  selectedOptionforprogrammetype = '';
  statusComment='';
  statuscommentbtnclick=false;
    blockUser(row:any){

    }

  
    gotoallotment(row:any){
    this.router.navigate(['/allocatefaculty/'+row.id]);  
    }

    gotoDetail(row:any){
    this.router.navigate(['/facultydetail/'+row.id]);  
    }

    addnewUser(){
    this.router.navigate(['/addfaculty']);
    }

handleProgrammetypeChange(value: string) {
    this.selectedOptionforprogrammetype = value;
    console.log('Selected value:', value);
    //this.getProgrammes();
}



handleAgencyChange(value: string) {
    this.selectedOptionagency = value;
    console.log('Selected value:', value);
  //  this.getProgrammes();
} 
    isOpen = false;
    modelItem:any;
    currentStatus='';
  openModal(row:any,status:string) {
    this.currentStatus=status;
    this.modelItem=row;
    console.log({'modelItem':this.modelItem});
     this.isOpen = true;
     this.statuscommentbtnclick=false;
     }

  closeModal() { 
    this.modelItem=null;
    this.isOpen = false; 
    this.statusComment='';
    this.statuscommentbtnclick=false;
  }
    dataRow:any=[];
    allData:any=[];
    programmeList:any=[];
    successmessage='';
    rejectcommentbtnclick=false;
    ngOnInit(){
      this.getRegistrationData();
      this.getActiveIAsData();
      
    }

    handleRadioChange(value: string) {
    this.statusvalue = value;
    this.getRegistrationData();
  }  

    getRegistrationData(){
      this.dataLoadProgress=true;
      this.dataRow=[];
      this.allData = [];
      this.selectedRowIndex = null;
      this.facultyservice.getRegistrationList(this.statusvalue).subscribe({
        next:(res:any[])=>{          
          this.dataRow = res;
          this.dataLoadProgress=false;
        },
        error:(err)=>{
          console.log(err);
          this.dataLoadProgress=false;
        }
      })
    }

    postStatus(row:any){   
      this.statuscommentbtnclick=true;     
    if(!this.statusComment){
      return;
    }

    this.updateStatus(row,this.currentStatus,this.statusComment);
    }

    updateStatus(row:any,status:string,comment:string){ 
      if(!comment){
       let confirmText = "Change record status to "+status+"?";
      if(confirm(confirmText)){
        this.facultyservice.updateRegistrationRecordStatus({id:row.id,status:status,comment:comment}).subscribe({
        next:(res=>{ 
          console.log({'res999999':res});
          this.closeModal();
          this.modelItem=null;
          this.successmessage= 'Status Change successfully.';
          this.getRegistrationData();
      setTimeout(() => {
        this.successmessage='';
      }, 5000);
        }),
        error:((err:any)=>{

        })
      });
      }
      }
      else{

          this.facultyservice.updateRegistrationRecordStatus({id:row.id,status:status,comment:comment}).subscribe({
        next:(res=>{ 
          console.log({'res999999':res});
          this.closeModal();
          this.modelItem=null;
          this.successmessage= 'Status Change successfully.';
          this.getRegistrationData();
      setTimeout(() => {
        this.successmessage='';
      }, 5000);
        }),
        error:((err:any)=>{

        })
      });

      }     
      
    }

    getActiveIAsData(){
      this.facultyservice.getActiveIASList().subscribe({
        next:(res:any[])=>{
          //var rejetedvalues = res.filter(f=>f.status=='REJECTED');
          console.log({'rejetedvalues9999999==':res});
        },
        error:(err)=>{console.log(err)}
      })
    }

  

  

  

  


  selectedRowIndex: number | null = null;

  toggleRowActions(index: number) {
    this.selectedRowIndex = this.selectedRowIndex === index ? null : index;
  }

  selectedRows: string[] = [];
  selectAll: boolean = false;
  rejectcomment='';
  

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
  statusvalue: string = 'NEW';

  


  changeStatus(row:any,status:any){ 
    let confirmText = (status=='true') ? 'Unblock this Trainer ?': 'Block this Trainer ?'
    if(confirm(confirmText)){
      this.facultyservice.updateTrainerStatus(row.id,status).subscribe({
      next:(response:any)=>{        
     // this.getProgrammes();
      this.successmessage=(status == 'true') ? 'Unblocked successfully.': 'Blocked successfully.';
      row.isActive = !row.isActive;
      setTimeout(() => {
        this.successmessage='';
      }, 5000);

      }
    });    
    }
  }

  

}


