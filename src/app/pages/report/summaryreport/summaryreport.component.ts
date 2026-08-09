import { Component, OnDestroy } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
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
import { RouterModule } from '@angular/router';
import { ProgrammeService } from '../../../services/programme.service';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { DatePickerComponent } from '../../../shared/components/form/date-picker/date-picker.component';
import { HelperService } from '../../../services/helper.service';
import { ReportService } from '../../../services/repost.service';
import { DataloadinprogressComponent } from '../../../shared/components/common/dataloadinprogress/dataloadinprogress.component';
import { DatanotfoundComponent } from '../../../shared/components/common/datanotfound/datanotfound.component';

@Component({
  selector: 'app-summaryreport',
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
  templateUrl: './summaryreport.component.html',
  styleUrl: './summaryreport.component.css',
})
export class SummaryreportComponent implements OnDestroy {
  constructor(private fb: FormBuilder,private reportservice:ReportService,public modal: ModalService,private helperService:HelperService){

    }

  filterForm!: FormGroup;
  orgCategoryId: number | null = null;
  orgSubCategoryId: number | null = null;
  private categorySub!: Subscription;

  dataLoadProgress=false;
  agenciesOptions:any=[];
  selectedOptionagency = '';
  selectedOptionforprogrammetype = 'ZEDTP';
  selectedStatedOptions:any=[];
  selectedStated='';
  curriculumnOption:any=[];
  curriculumnselect='All';

handleCuricullumnChange(value: string) {
    this.curriculumnselect = value;
    this.filterMainData();
}

handleAgencyChange(value: string) {
    this.selectedOptionagency = value;
    this.filterMainData();
}
handleStateChange(value: string) {
    this.selectedStated = value;
    this.filterMainData();
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
    ngOnInit(){
      this.loadFilterState();

      if (this.helperService.IsAgency()) {
        this.orgCategoryId = this.helperService.getOrgCategoryId();
        this.orgSubCategoryId = this.helperService.getOrgSubCategoryId();
        this.loadCurriculum();
        this.loadAgencies();
        this.getProgrammes();
      } else {
        this.categorySub = combineLatest([
          this.helperService.category$,
          this.helperService.subCategory$
        ]).subscribe(([catId, subCatId]) => {
          this.orgCategoryId = catId;
          this.orgSubCategoryId = subCatId;
          this.loadCurriculum();
          this.loadAgencies();
          this.getProgrammes();
        });
      }
    }

    ngOnDestroy() {
      this.categorySub?.unsubscribe();
    }

    rejectProgramme(row:any,status:any){
      this.openModal(row);
  }

  handleSave() {  
    this.rejectcommentbtnclick=true;
    if(!this.rejectcomment){
      return;
    }
      this.reportservice.rejectProgrammeStatus(this.modelItem.batchNo,this.rejectcomment,"5").subscribe({
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
    this.programmeList=[];
    this.reportservice.getSummaryReport(this.orgCategoryId, this.orgSubCategoryId).subscribe({
      next:(response:any[])=>{
        this.programmeList = response;
        this.filterMainData();
        this.dataLoadProgress=false;
      },
      error:(err:any)=>{
        this.dataLoadProgress=false;
      }
    });
  }

  filterMainData(){
    this.dataRow = [];
    let filteredData = [...this.programmeList];

    if(this.selectedOptionforprogrammetype){
      filteredData = filteredData.filter((f:any)=> f.programType == this.selectedOptionforprogrammetype);
    }
    if(this.selectedStated && this.selectedStated !== 'All'){
      filteredData = filteredData.filter((f:any)=> f.stateId == this.selectedStated);
    }
    if(this.curriculumnselect && this.curriculumnselect !== 'All'){
      filteredData = filteredData.filter((f:any)=> f.qpCode == this.curriculumnselect);
    }
    if(this.selectedOptionagency && this.selectedOptionagency !== 'All'){
      filteredData = filteredData.filter((f:any)=> f.agencyName == this.selectedOptionagency);
    }
    this.dataRow = filteredData;
  }



  exportExcel(){
    var filters={
      Type:this.selectedOptionforprogrammetype,
      State:this.selectedStated,
      Agency:this.selectedOptionagency,
      QpCode:this.curriculumnselect,
      OrgCategoryId:this.orgCategoryId,
      OrgSubCategoryId:this.orgSubCategoryId,
    }

    this.reportservice.exportToExcel(filters).subscribe({
      next:(response : any)=>{     
        
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

  loadAgencies(){
    this.agenciesOptions=[];
    this.reportservice.getActiveAgencyList(this.orgCategoryId, this.orgSubCategoryId).subscribe({
        next:(response:any)=>{
          response.forEach((element:any) => {
            this.agenciesOptions.push({value:element.firstName,label: element.firstName});
          });
          this.agenciesOptions.unshift({value:'All',label:'All'});
        },
        error: (error:any) => {console.error('Error:', error)
      }
    });
  }


  loadFilterState(){
    this.helperService.getAllStates().subscribe({
      next:(response:any)=>{
       response.forEach((element:any) => {
            this.selectedStatedOptions.push({value:element.stateID,label: element.stateName});
          });
          this.selectedStatedOptions.unshift({value:'All',label:'All'});
      }
    }); 
  }

  loadCurriculum(){
    this.curriculumnOption=[];
    this.reportservice.getCurriculumList(this.selectedOptionforprogrammetype, this.orgCategoryId, this.orgSubCategoryId).subscribe({
      next:(response:any)=>{
       response.forEach((element:any) => {
            this.curriculumnOption.push({value:element.qpCode,label: element.qpName});
          });
          this.curriculumnOption.unshift({value:'All',label:'All'});
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
    let confirmText = (status==3) ? 'Approve this Programme ?': 'Reject this Programme ?'
    if(confirm(confirmText)){
      this.reportservice.updateProgrammeStatus(row.batchNo,status).subscribe({
      next:(response:any)=>{        
      this.getProgrammes();
      this.successmessage=(status == 3) ? 'Approved successfully.': 'Rejected successfully.';
      setTimeout(() => {
        this.successmessage='';
      }, 5000);

      }
    });    
    }
  }

  

}

