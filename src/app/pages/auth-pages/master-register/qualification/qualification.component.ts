// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-qualification',
//   imports: [],
//   templateUrl: './qualification.component.html',
//   styleUrl: './qualification.component.css',
// })
// export class QualificationComponent {

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


import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ComponentCardComponent } from '../../../../shared/components/common/component-card/component-card.component';
// import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';

 import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { AvatarTextComponent } from '../../../../shared/components/ui/avatar/avatar-text.component';
import { CheckboxComponent } from '../../../../shared/components/form/input/checkbox.component';

import { RadioComponent } from '../../../../shared/components/form/input/radio.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { ModalService } from '../../../../shared/services/modal.service';
import { InputFieldComponent } from '../../../../shared/components/form/input/input-field.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { Router, RouterModule } from '@angular/router';

import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../../shared/components/form/select/select.component';
import { DatePickerComponent } from '../../../../shared/components/form/date-picker/date-picker.component';

import { FacultyService } from '../../../../services/faculty.service';
import { FileInputComponent } from '../../../../shared/components/form/input/file-input.component';
import { HelperService } from '../../../../services/helper.service';

@Component({
  selector: 'app-qualification',
  imports: [
    ComponentCardComponent,
    BadgeComponent,
    AvatarTextComponent,
    CheckboxComponent,
    FormsModule,
    ReactiveFormsModule,
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
    FileInputComponent
    
  ],
  templateUrl: './qualification.component.html',
  styleUrl: './qualification.component.css',
})
export class QualificationComponent {
  constructor(private fb: FormBuilder,private facultyservice:FacultyService,public modal: ModalService,private router: Router,public helper:HelperService){
      
    }

    filterForm!: FormGroup;

  
  agenciesOptions:any=[];
  programmetypeOptions:any=[];
  selectedOptionagency = '';
  selectedOptionforprogrammetype = '';
  @Input() qualificationList: any[] = [];
  viewOnly=false;
@Output() onQualificationSubmit = new EventEmitter<any>();
  blockUser(row:any){

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
    qualificationForm!: FormGroup;
    dateValue: any;
    @ViewChild('fileInput') fileInput!: ElementRef;
    ngOnInit(){
      this.createForm();
      this.getTempData();      
      this.dataRow = this.qualificationList;
      if(this.qualificationList.length){
        this.viewOnly=true;
      }
    }

    createForm(){{
      this.qualificationForm = this.fb.group({
      startdate: ['', [Validators.required]],
      enddate: ['', [Validators.required]],
      institution: ['', [Validators.required]],
      qualification: ['', [Validators.required]],
      document: ['', [Validators.required]],
    });
    }}

    resetForm(){
      this.qualificationForm.reset();
    }
    addnewUser(){
    //this.openModal(this.dataRow[0]);
    this.openModal({});
    }

    handleStartDateChange(event:any){
      this.dateValue = event;
    console.log('Date changed:', event);
    let dtstr = event.dateStr.split('-');
    console.log(dtstr);
    this.qualificationForm.controls['startdate'].setValue((dtstr[2]+dtstr[0]+dtstr[1]));//yymmdd
    }

    handleEndDateChange(event:any){
        this.dateValue = event;
    console.log('Date changed:', event);
    let dtstr = event.dateStr.split('-');
    console.log(dtstr);
    this.qualificationForm.controls['enddate'].setValue((dtstr[2]+dtstr[0]+dtstr[1]));//yymmdd

    }

    getTempData(){
      this.dataRow=[];
     // this.dataRow.push({year:'1901',institue:'PTU1',qualification:'test qualification1',certificate:'test certificate1'});
      //this.dataRow.push({year:'1902',institue:'PTU2',qualification:'test qualification2',certificate:'test certificate2'});
      
    }

    rejectProgramme(row:any,status:any){
      this.openModal(row);
  }

  async handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      console.log('Selected file:', file);
      // Convert bytes to KB: 1 KB = 1024 bytes
      var kbsize= Math.round(file.size / 1024);
      if(kbsize > 2000){
        alert('File size is greater than 2000kb');        
      }
      //this.qualificationForm.controls['document'].setValue(file);
      this.qualificationForm.controls['document'].setValue(await this.helper.convertFileToBase64(file));
    }
  }

  handleSave() {  
    console.log({'form value':this.qualificationForm.value});
    var formdata = this.qualificationForm.value;
    this.dataRow.push({year:formdata.startdate,
      institue:formdata.institution,
      qualification:formdata.qualification,
      certificate:formdata.document.name});
      this.onQualificationSubmit.emit(this.dataRow);
      this.resetForm();
      this.closeModal();

    // this.rejectcommentbtnclick=true;
    // if(!this.rejectcomment){
    //   return;
    // }
    //   this.facultyservice.rejectProgrammeStatus(this.modelItem.batchNo,this.rejectcomment,"5").subscribe({
    //   next:(response:any)=>{  
    //     console.log({'response':response}); 
    //   this.closeModal();     
    //   this.getProgrammes();

    //   this.successmessage= 'Rejected successfully.';
    //   setTimeout(() => {
    //     this.successmessage='';
    //   }, 5000);

    //   }
    // }); 

    
  }

  getProgrammes(){    
    this.dataRow=[];

    // this.facultyservice.getTrainerList('').subscribe({
    //   next:(response:any[])=>{
    //     console.log({'Trainer List':response});        
    //     this.dataRow = response;
    //     //this.programmeList=response;
    //   }
    // });    
  }

  // loadAgencies(){
  //   this.agenciesOptions=[];
  //   this.facultyservice.getActiveAgencyList().subscribe({
  //       next:(response:any)=>{
  //         console.log({'response state':response});          
  //         response.forEach((element:any) => {
  //           this.agenciesOptions.push({value:element.userId,label: element.firstName});
  //         });
  //       },
  //       error: (error:any) => {console.error('Error:', error)
  //     }
  //   });
  // }

  // loadProgrammeType(){
  //   var pt =this.helperService.getUserTraingProgrammeswithValue();    
  //   pt.forEach((element:any) => {
  //           this.programmetypeOptions.push({value:element.qpCode,label: element.qpName});
  //         });

  // }

  selectedRows: string[] = [];
  selectAll: boolean = false;
  rejectcomment='';
  

  

  changeStatus(row:any,status:any){ 
    // let confirmText = (status=='true') ? 'Unblock this Trainer ?': 'Block this Trainer ?'
    // if(confirm(confirmText)){
    //   this.facultyservice.updateTrainerStatus(row.id,status).subscribe({
    //   next:(response:any)=>{        
    //   this.getProgrammes();
    //   this.successmessage=(status == 'true') ? 'Unblocked successfully.': 'Blocked successfully.';
    //   row.isActive = !row.isActive;
    //   setTimeout(() => {
    //     this.successmessage='';
    //   }, 5000);

    //   }
    // });    
    // }
  }

  

}

