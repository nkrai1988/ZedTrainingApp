// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-technicalskills',
//   imports: [],
//   templateUrl: './technicalskills.component.html',
//   styleUrl: './technicalskills.component.css',
// })
// export class TechnicalskillsComponent {

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
  selector: 'app-technicalskills',
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
  templateUrl: './technicalskills.component.html',
  styleUrl: './technicalskills.component.css',
})
export class TechnicalskillsComponent {
  constructor(private fb: FormBuilder,private facultyservice:FacultyService,public helper:HelperService,public modal: ModalService,private router: Router){
      
    }

    filterForm!: FormGroup;

  
  agenciesOptions:any=[];
  programmetypeOptions:any=[];
  selectedOptionagency = '';
  selectedOptionforprogrammetype = '';
  disciplineOptions:any=[];
  disciplineselect='';

  experienceOptions:any=[];
  experienceselect='';

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
    @ViewChild('fileInput') fileInput!: ElementRef;
    @Output() onSkillSubmit = new EventEmitter<any>();
    @Input() skillList: any[] = [];
    disciplineMeta:any;
    viewOnly=false;
    ngOnInit(){
      this.createForm();
      this.getTempData();
      this.bindrange();
      this.loadDiscipline();
      this.loadExperience();

      this.qualificationForm.get('experiencetype')?.valueChanges.subscribe(value => {
        const Organization = this.qualificationForm.get('Organization');
        const role = this.qualificationForm.get('role');

        const trainingname = this.qualificationForm.get('trainingname');
        const conductedby = this.qualificationForm.get('conductedby');
        const proof = this.qualificationForm.get('proof');

        if (value === 'TrainingOrCertificationPrograms') {
          trainingname?.setValidators([Validators.required]);
          conductedby?.setValidators([Validators.required]);
          proof?.setValidators([Validators.required]);

          Organization?.clearValidators();
          role?.clearValidators();

        } else {
          Organization?.setValidators([Validators.required]);
          role?.setValidators([Validators.required]);
          trainingname?.clearValidators();
          conductedby?.clearValidators();
          proof?.clearValidators();
        }

        Organization?.updateValueAndValidity();
        role?.updateValueAndValidity();
        trainingname?.updateValueAndValidity();
        conductedby?.updateValueAndValidity();
        proof?.updateValueAndValidity();
        });
      this.dataRow =this.skillList;
      if(this.skillList.length){
        this.viewOnly=true;
      }
    }

    bindrange(){
      var data= this.helper.getDayMonthYearRange();
      console.log({'data':data});
      this.yearOptions = this.helper.createOptions(data.Years);
      console.log({'this.yearOptions':this.yearOptions});
      this.monthOptions = this.helper.createOptions(data.Months);
      this.dayOptions = this.helper.createOptions(data.Days);
    }

    

    createForm(){{
      this.qualificationForm = this.fb.group({
      discipline: ['', [Validators.required]],
      disciplinemeta: ['', [Validators.required]],
      disciplinegroup: ['', [Validators.required]],
      experiencetype: ['', [Validators.required]],
      Organization : [''],
      role : [''],
      trainingname: [''],
      conductedby: [''],
      durationyear: ['', [Validators.required]],
      durationmonth: [''],
      durationday: [''],
      proof: [''],
    });
    }}

    

    addnewUser(){
    this.openModal(this.dataRow[0]);
    }

    loadDiscipline(){
      var options=[];
      options.push({label:'A - Best Business Practices',value:'Best Business Practices',group:'A',description:'Know-how of Best Business Practices like Balanced Score Card, Six Sigma, Risk Management, Corporate Social Responsibility (CSR), etc.'});
      options.push({label:'Industry A - Good Manufacturing Practices',value:'Good Manufacturing Practices',group:'A',description:'Know-how of Good Manufacturing practices like Lean, TQM, TPM, FMEA, SPC, Poka-Yoke / mistake proofing, OEE, Product and Process Validation, etc.'});
      options.push({label:'B - QMS',value:'QMS' ,group:'B',description:'Quality Management System, Quality Improvement Tools & techniques, Auditing.'});
      options.push({label:'B - Occupational Health & Safety',value:'Occupational Health & Safety',group:'B',description:'Occupational Health & Safety Management System, Safety Practices and Auditing.'});
      options.push({label:'B - Environment Management',value:'Environment Management',group:'B',description:'Environment Management System, Environmental Impact Assessment, Natural Resource Management, Auditing.'});
      options.push({label:'C - Energy Management',value:'Energy Management',group:'C',description:'Energy efficiency & conservation techniques, Energy Management and Auditing.'});
      options.push({label:'C - Material & Supply Chain Management',value:'Material & Supply Chain Management',group:'C',description:'Material and Inventory Management, Traceability and Supply Chain Management.'});
      options.push({label:'C - Human Resource Management',value:'Human Resource Management',group:'C',description:'Human Resource Management, Competency Mapping, Multiskilling, Employee Engagement Techniques.'});

      this.disciplineOptions = options;
    }

    loadExperience(){
      var options=[];
      options.push({label:'Training /Certification',value:'TrainingOrCertificationPrograms'});
      options.push({label:'Experience',value:'HandsOnExperience'});
      this.experienceOptions = options;
    }

    handleDisciplineSelectChange(event:any){
    console.log({'event':event});
    this.disciplineMeta =this.disciplineOptions.find((f:any)=> f.value == event);
    console.log({'op':this.disciplineMeta});
    this.qualificationForm.controls['discipline'].setValue(event);
    this.qualificationForm.controls['disciplinemeta'].setValue(this.disciplineMeta);
    this.qualificationForm.controls['disciplinegroup'].setValue(this.disciplineMeta.group);
    }

    handleExperienceSelectChange(event:any){
    console.log({'event':event});
    this.experienceselect=event;
    this.qualificationForm.controls['experiencetype'].setValue(event);
    }

    // handleEndDateChange(event:any){
    //     this.dateValue = event;
    // console.log('Date changed:', event);
    // let dtstr = event.dateStr.split('-');
    // console.log(dtstr);
    // this.qualificationForm.controls['enddate'].setValue((dtstr[2]+dtstr[0]+dtstr[1]));//yymmdd
    // }

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

  handleSave() {  
        console.log({'form value':this.qualificationForm.value});
    this.qualificationForm.markAllAsTouched(); 
if (this.qualificationForm.invalid) return;
    console.log({'form value':this.qualificationForm.value});
    var formdata = this.qualificationForm.value;
    this.dataRow.push(formdata);//,
    // this.dataRow.push({year:formdata.startdate,
    //   institue:formdata.institution,
    //   qualification:formdata.qualification,
    //   certificate:formdata.proof.name});
      this.onSkillSubmit.emit(this.dataRow);
      this.closeModal();
  }

  getProgrammes(){    
    this.dataRow=[];
  }

  

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

