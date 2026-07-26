

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
import { RouterModule } from '@angular/router';
import { ProgrammeService } from '../../../services/programme.service';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { DatePickerComponent } from '../../../shared/components/form/date-picker/date-picker.component';
import { HelperService } from '../../../services/helper.service';
import { DataloadinprogressComponent } from '../../../shared/components/common/dataloadinprogress/dataloadinprogress.component';
import { DatanotfoundComponent } from '../../../shared/components/common/datanotfound/datanotfound.component';

@Component({
  selector: 'app-viewreport',
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
  templateUrl: './viewreport.component.html',
  styleUrl: './viewreport.component.css',
})
export class ViewreportComponent {
  constructor(private fb: FormBuilder,private programmeservice:ProgrammeService,public modal: ModalService,private helperService:HelperService){
      
    }

    filterForm!: FormGroup;

  dataLoadProgress=false;
  agenciesOptions:any=[];
  selectedOptionagency = 'All';
  selectedOptionforprogrammetype = 'ZEDTP';

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
    userRole=0;
    ngOnInit(){
      this.getProgrammes();
      this.loadAgencies();
      this.userRole = this.helperService.getUserRole();
    }

    rejectProgramme(row:any,status:any){
      this.openModal(row);
  }

  exportExcel(){
    this.programmeservice.exportToExcelViewReport(this.selectedOptionforprogrammetype,this.selectedOptionagency).subscribe({
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

  handleSave() {  
    this.rejectcommentbtnclick=true;
    if(!this.rejectcomment){
      return;
    }
      this.programmeservice.qcRejectProgramme(this.modelItem.batchNo,this.rejectcomment).subscribe({
      next:(response:any)=>{  
        
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
    this.dataLoadProgress=true;
    this.programmeservice.getViewReportList(this.selectedOptionforprogrammetype,this.selectedOptionagency).subscribe({
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
    this.programmeservice.getActiveAgencyList().subscribe({
        next:(response:any)=>{
          response.forEach((element:any) => {
            this.agenciesOptions.push({value:element.userId,label: element.firstName});
          });
          this.agenciesOptions.unshift({value:'All',label:'All'});
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

  

  getStatusBadgeColor(type: string): 'success' | 'warning' | 'error'|'info' {
   
    if (type === '1' || type === '3') return 'success';
    if (type === '0') return 'info';
    if (type === '2' || type === '6' || type === '11' || type === '12') return 'warning';
    if (type === '4' || type === '5' || type === '7') return 'error';
    return 'error';
  }

  downloadPdf(batchNo: string) {
    this.programmeservice.downloadBatchPdf(batchNo).subscribe({
      next: (response: any) => {
        const blob = response.body as Blob;
        let fileName = `${batchNo}.pdf`;
        const contentDisposition = response.headers.get('Content-Disposition');
        if (contentDisposition) {
          const match = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
          if (match && match[1]) fileName = match[1].replace(/['"]/g, '');
        }
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      error: (err: any) => {
        console.error('PDF download error:', err);
      }
    });
  }

  selectedValue: string = 'option2';
  statusvalue: string = '3';


  changeStatus(row:any,status:any){ 
    let confirmText = (status==3) ? 'Approve this Programme ?': 'Reject this Programme ?'
    if(confirm(confirmText)){
      this.programmeservice.updateProgrammeStatus(row.batchNo,status).subscribe({
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

