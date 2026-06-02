// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-zedfaculty',
//   imports: [],
//   templateUrl: './zedfaculty.component.html',
//   styleUrl: './zedfaculty.component.css',
// })
// export class ZedfacultyComponent {

// }


import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
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
import { DatanotfoundComponent } from '../../../shared/components/common/datanotfound/datanotfound.component';
import { DataloadinprogressComponent } from '../../../shared/components/common/dataloadinprogress/dataloadinprogress.component';

@Component({
  selector: 'app-zedfaculty',
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
    DatanotfoundComponent,
    DataloadinprogressComponent
    
  ],
  templateUrl: './zedfaculty.component.html',
  styleUrl: './zedfaculty.component.css',
})
export class ZedfacultyComponent implements OnDestroy {
  private categorySub: Subscription = new Subscription();

  constructor(private fb: FormBuilder,private facultyservice:FacultyService,public modal: ModalService,public helperService:HelperService,private router: Router){

    }

    filterForm!: FormGroup;

  dataLoadProgress=false;
  agenciesOptions:any=[];
  programmetypeOptions:any=[];
  selectedOptionagency = '';
  selectedOptionforprogrammetype = '';
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
    this.getProgrammes();
}

handleAgencyChange(value: string) {
    this.selectedOptionagency = value;
    console.log('Selected value:', value);
    this.getProgrammes();
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
    rejectcommentbtnclick=false;
    orgCategory='';
    ngOnInit(){
      this.selectedOptionforprogrammetype = this.helperService.userTrainingProgrammeDefaultValue();
      this.loadProgrammeType();
      this.loadAgencies();
      if (this.helperService.IsMasterAdmin()) {
        this.categorySub = this.helperService.category$.subscribe(cat => {
          this.orgCategory = cat;
          this.dataRow = [];
          this.getProgrammes();
        });
      } else if (this.helperService.IsSuperAdmin()) {
        this.orgCategory = this.helperService.getOrgCategory() || '';
        this.getProgrammes();
      } else {
        this.orgCategory = this.helperService.getOrgCategory() || '';
        this.getProgrammes();
      }
    }

    ngOnDestroy(){
      this.categorySub.unsubscribe();
    }

    rejectProgramme(row:any,status:any){
      this.openModal(row);
  }

  handleSave() {  
    this.rejectcommentbtnclick=true;
    if(!this.rejectcomment){
      return;
    }
      this.facultyservice.rejectProgrammeStatus(this.modelItem.batchNo,this.rejectcomment,"5").subscribe({
      next:(response:any)=>{  
        console.log({'response':response}); 
      this.closeModal();     
      this.getProgrammes();

      this.successmessage= 'Rejected successfully.';
      setTimeout(() => {
        this.successmessage='';
      }, 5000);

      }
    }); 

    
  }

  getProgrammes(){
    this.dataLoadProgress=true;
    this.dataRow=[];
    this.facultyservice.getFacultyList('', this.orgCategory).subscribe({
      next:(response:any[])=>{        
        this.dataRow = response;
        this.dataLoadProgress=false;
      },
      error:(err:any)=>{
        this.dataLoadProgress=false;
      }
    });    
  }

  loadAgencies(){
    this.agenciesOptions=[];
    this.facultyservice.getActiveAgencyList().subscribe({
        next:(response:any)=>{
          console.log({'response state':response});          
          response.forEach((element:any) => {
            this.agenciesOptions.push({value:element.userId,label: element.firstName});
          });
        },
        error: (error:any) => {console.error('Error:', error)
      }
    });
  }

  loadProgrammeType(){
    var pt =this.helperService.getUserTraingProgrammeswithValue();    
    pt.forEach((element:any) => {
            this.programmetypeOptions.push({value:element.qpCode,label: element.qpName});
          });

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
  statusvalue: string = '3';

  handleRadioChange(value: string) {
    this.statusvalue = value;
    this.getProgrammes();
  }  


  changeStatus(row:any,status:any){ 
    let confirmText = (status=='true') ? 'Unblock this Trainer ?': 'Block this Trainer ?'
    if(confirm(confirmText)){
      this.facultyservice.updateTrainerStatus(row.id,status).subscribe({
      next:(response:any)=>{        
      this.getProgrammes();
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

