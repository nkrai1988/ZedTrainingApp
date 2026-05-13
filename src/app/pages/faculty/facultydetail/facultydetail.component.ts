// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-facultydetail',
//   imports: [],
//   templateUrl: './facultydetail.component.html',
//   styleUrl: './facultydetail.component.css',
// })
// export class FacultydetailComponent {

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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProgrammeService } from '../../../services/programme.service';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { DatePickerComponent } from '../../../shared/components/form/date-picker/date-picker.component';
import { HelperService } from '../../../services/helper.service';
import { FacultyService } from '../../../services/faculty.service';

@Component({
  selector: 'app-facultydetail',
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
  templateUrl: './facultydetail.component.html',
  styleUrl: './facultydetail.component.css',
})
export class FacultydetailComponent {
  constructor(private fb: FormBuilder,private facultyservice:FacultyService,public modal: ModalService,private helperService:HelperService,private router: Router,private route:ActivatedRoute){
      
    }

    filterForm!: FormGroup;

  
  agenciesOptions:any=[];
  programmetypeOptions:any=[];
  selectedOptionagency = '';
  selectedOptionforprogrammetype = '';
    blockUser(row:any){

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
    trainerid='';
    trainerDetail:any='';
    ngOnInit(){
      this.route.params.subscribe(params => {      
      if(params['id']){
         this.trainerid = params['id'];
        this.loadAgencies();
      }});
      
      
      
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
    this.dataRow=[];
    this.facultyservice.getTrainerList('').subscribe({
      next:(response:any[])=>{
        console.log({'Trainer List':response});        
        this.dataRow = response;
        //this.programmeList=response;
      }
    });    
  }

  loadAgencies(){
    this.agenciesOptions=[];
    this.facultyservice.getTrainerDetail(this.trainerid).subscribe({
        next:(response:any)=>{
          console.log({'response state9999':response});          
          if(response.batches && response.batches.length){
            this.dataRow= response.batches;
          }
          if(response.trainder){
            this.trainerDetail= response.trainder;
          }
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

