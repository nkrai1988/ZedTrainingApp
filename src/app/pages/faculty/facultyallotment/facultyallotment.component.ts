// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-facultyallotment',
//   imports: [],
//   templateUrl: './facultyallotment.component.html',
//   styleUrl: './facultyallotment.component.css',
// })
// export class FacultyallotmentComponent {

// }



import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';

import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { CheckboxComponent } from '../../../shared/components/form/input/checkbox.component';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { ModalService } from '../../../shared/services/modal.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProgrammeService } from '../../../services/programme.service';
import { HelperService } from '../../../services/helper.service';
import { FacultyService } from '../../../services/faculty.service';

@Component({
  selector: 'app-facultyallotment',
  imports: [
    ComponentCardComponent,
    BadgeComponent,
    CheckboxComponent,
    FormsModule,
    CommonModule,
    AlertComponent,
    ModalComponent,
    ButtonComponent,
    RouterModule,
  ],
  templateUrl: './facultyallotment.component.html',
  styleUrl: './facultyallotment.component.css',
})
export class FacultyallotmentComponent {
  constructor(private fb: FormBuilder,private facultyservice:FacultyService,public modal: ModalService,private helperService:HelperService,private router: Router,private route:ActivatedRoute){
      
    }

    filterForm!: FormGroup;
  selectedItems:any=[];
  agenciesOptions:any=[];
  programmetypeOptions:any=[];
  selectedOptionagency = '';
  selectedOptionforprogrammetype = '';

    blockUser(row:any){

    }

  


    addnewUser(){
    this.router.navigate(['/addfaculty']);
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
    ngOnInit(){
      this.route.params.subscribe(params => {      
      if(params['id']){
         this.trainerid = params['id'];
        this.loadAgencies();
      }});
    }

    handlecheckboxclick(row:any,value:any){
      row.isChecked=value;
      if(value){
         row.agency= row.userId
         this.allocatetoAgency(row);
      }
      else{
        row.agency='';
        this.unallocate(row);
      }
  }

  

  allocatetoAgency(row:any){
    let confirmText ='Are you sure you want to assign?'
    if(confirm(confirmText)){
      this.facultyservice.allocateTrainer(this.trainerid, row.userId).subscribe({
      next:(response:any)=>{
      this.successmessage='Assignment successfully.';
      setTimeout(() => {
        this.successmessage='';
      }, 5000);

      }
    });    
    }
    else{
      this.loadAgencies();
    }
  }

  unallocate(row:any){
      let confirmText ='Are you sure you want to un-assign?'
    if(confirm(confirmText)){
      this.facultyservice.unallocateTrainer(this.trainerid, row.userId).subscribe({
      next:(response:any)=>{
      this.successmessage='Un-Assignment successfully.';
      setTimeout(() => {
        this.successmessage='';
      }, 5000);

      }
    });    
    }
    else{
      this.loadAgencies();
    }
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
      this.loadAgencies();

      this.successmessage= 'Rejected successfully.';
      setTimeout(() => {
        this.successmessage='';
      }, 5000);

      }
    }); 

    
  }

  

  loadAgencies(){
    this.agenciesOptions=[];
    this.dataRow=[];
    this.facultyservice.getAgencyAllotmentList(this.trainerid).subscribe({
        next:(response:any)=>{          
          response.forEach((element:any) => {
            element.isChecked=(element.agency ? true:false);
            this.dataRow.push(element); 
          });         
         console.log({'dataRow':this.dataRow});
        },
        error: (error:any) => {console.error('Error:', error)
      }
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

  

  

    


  

  

}

