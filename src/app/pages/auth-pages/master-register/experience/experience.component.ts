
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
import { Router, RouterModule, TitleStrategy } from '@angular/router';

import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../../shared/components/form/select/select.component';
import { DatePickerComponent } from '../../../../shared/components/form/date-picker/date-picker.component';

import { FacultyService } from '../../../../services/faculty.service';
import { FileInputComponent } from '../../../../shared/components/form/input/file-input.component';
import { HelperService } from '../../../../services/helper.service';

@Component({
  selector: 'app-experience',
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
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css',
})
export class ExperienceComponent {
  constructor(private fb: FormBuilder,private facultyservice:FacultyService,public helper:HelperService,public modal: ModalService,private router: Router){
      
    }

  filterForm!: FormGroup;
  agenciesOptions:any=[];
  programmetypeOptions:any=[];
  selectedOptionagency = '';
  selectedOptionforprogrammetype = '';
  yearOptions =[];
  yearselect='';

  monthOptions =[];
  monthselect='';

  dayOptions =[];
  dayselect='';

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
    experiencecOption:any=[];
    experienceselect='';
    checkedValue='';
    @Input() experienceList = [];
    viewOnly=false;
@Output() onExperienceSubmit = new EventEmitter<any>();
    @ViewChild('fileInput') fileInput!: ElementRef;
    ngOnInit(){
      this.createForm();
      this.getTempData();
      this.bindrange();
      this.loadExperience();
      console.log({'qualificationList':this.experienceList});
      this.dataRow = this.experienceList;
      if(this.experienceList.length){
        this.viewOnly=true;
      }
    }

    createForm(){{
      this.qualificationForm = this.fb.group({
      knowledge : ['', [Validators.required]],
      experience: ['', [Validators.required]],      
      trainingname: [''],
      organizationname: [''],
      role: [''],
      durationyear: ['', [Validators.required]],
      durationmonth: [''],
      durationday: [''],
      proof: ['', [Validators.required]],
    });
    }}

    handleKnowledgeRadioChange(value:string){
      this.checkedValue=value;
      this.qualificationForm.controls['knowledge'].setValue(value);
    }


    loadExperience(){
      var options=[];
      options.push({label:'Certification',value:'TrainingOrCertificationPrograms'});
      options.push({label:'Industry Experience',value:'HandsOnExperience'});
      options.push({label:'Audit/Assessment Experience',value:'AuditOrAssessmentExperience'});
      options.push({label:'Consultancy Experience',value:'ConsultancyExperience'});
      options.push({label:'Training Experience',value:'TrainingExperience'});
      this.experiencecOption=options;
    }

    bindrange(){
      var data= this.helper.getDayMonthYearRange();
      console.log({'data':data});
      this.yearOptions = this.helper.createOptions(data.Years);
      console.log({'this.yearOptions':this.yearOptions});
      this.monthOptions = this.helper.createOptions(data.Months);
      this.dayOptions = this.helper.createOptions(data.Days);
    }

    handleTypeofExperienceSelectChange(value:any){
      console.log({'value':value});
    this.qualificationForm.controls['experience'].setValue(value);//yymmdd
    }

    handleYearSelectChange(value:any){
      console.log({'value':value});
    this.qualificationForm.controls['durationyear'].setValue(value);//yymmdd
    }

    handleMonthSelectChange(value:any){
      console.log({'value':value});
    this.qualificationForm.controls['durationmonth'].setValue(value);//yymmdd
    }

    handleDaysSelectChange(value:any){
      console.log({'value':value});
    this.qualificationForm.controls['durationday'].setValue(value);//yymmdd
    }

    handleDisciplineSelectChange(event:any){
    //   this.dateValue = event;
    // console.log('Date changed:', event);
    // let dtstr = event.dateStr.split('-');
    // console.log(dtstr);
    // this.qualificationForm.controls['startdate'].setValue((dtstr[2]+dtstr[0]+dtstr[1]));//yymmdd
    }

    addnewUser(){
    this.openModal(this.dataRow[0]);
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
      //this.dataRow.push({year:'1901',institue:'PTU1',qualification:'test qualification1',certificate:'test certificate1'});
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
      //this.qualificationForm.controls['proof'].setValue(file);
      this.qualificationForm.controls['proof'].setValue(await this.helper.convertFileToBase64(file));
    }
  }

  handleSave() {  
    console.log({'form value':this.qualificationForm.value});
    this.qualificationForm.markAllAsTouched(); 
if (this.qualificationForm.invalid) return;
    var formdata = this.qualificationForm.value;  
    console.log({'formdata':formdata});
    this.dataRow.push(formdata);  
    // this.dataRow.push({year:formdata.startdate,
    //   institue:formdata.institution,
    //   qualification:formdata.qualification,
    //   certificate:formdata.document.name});
      this.onExperienceSubmit.emit(this.dataRow);
      this.closeModal();
  }

  getProgrammes(){    
    this.dataRow=[];
  }

  

  selectedRows: string[] = [];
  selectAll: boolean = false;
  rejectcomment='';
  

  

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

