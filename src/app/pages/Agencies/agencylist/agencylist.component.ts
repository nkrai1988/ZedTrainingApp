import { Component, OnDestroy } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { BasicTableTwoComponent } from '../../../shared/components/tables/basic-tables/basic-table-two/basic-table-two.component';
import { AgencyService } from '../../../services/agencies.service';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { AvatarTextComponent } from '../../../shared/components/ui/avatar/avatar-text.component';
import { CheckboxComponent } from '../../../shared/components/form/input/checkbox.component';

import { RadioComponent } from '../../../shared/components/form/input/radio.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { ModalService } from '../../../shared/services/modal.service';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { RouterModule } from '@angular/router';
import { DataloadinprogressComponent } from '../../../shared/components/common/dataloadinprogress/dataloadinprogress.component';
import { DatanotfoundComponent } from '../../../shared/components/common/datanotfound/datanotfound.component';
import { HelperService } from '../../../services/helper.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-agencylist',
  imports: [
    ComponentCardComponent,
    BadgeComponent,
    AvatarTextComponent,
    CheckboxComponent,
    FormsModule,
    RadioComponent,
    CommonModule,
    AlertComponent,
    ModalComponent,
    InputFieldComponent,
    ButtonComponent,
    RouterModule,
    DataloadinprogressComponent,
    DatanotfoundComponent
    
  ],
  templateUrl: './agencylist.component.html',
  styleUrl: './agencylist.component.css',
})
export class AgencylistComponent implements OnDestroy {
  private categorySub: Subscription = new Subscription();

  constructor(private agencyservice:AgencyService,public modal: ModalService,private helperService:HelperService){

    }
    isOpen = false;
    modelItem:any;
    dataLoadProgress:boolean=false;
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
    successmessage='';
    orgCategory='';
    ngOnInit(){
      if (this.helperService.IsMasterAdmin()) {
        this.categorySub = this.helperService.category$.subscribe(cat => {
          this.orgCategory = cat;
          this.dataRow = [];
          this.getAgencies();
        });
      } else if (this.helperService.IsSuperAdmin()) {
        this.orgCategory = this.helperService.getOrgCategory() || '';
        this.getAgencies();
      } else {
        this.getAgencies();
      }
    }

    ngOnDestroy(){
      this.categorySub.unsubscribe();
    }

    handleSave() {
    // Handle save logic here
    console.log('Saving changes...');
    this.modal.closeModal();
  }

    getAgencies(){
    this.dataLoadProgress=true;
    this.agencyservice.getAgencyList(this.checkedValue, this.orgCategory).subscribe({
      next:(response:any[])=>{
      this.dataRow = response;
      this.dataLoadProgress=false;
      },
      error:(err:any)=>{
        this.dataLoadProgress=false;
      }
    });    
  }

  exportExcel(){
    
    this.agencyservice.exportToExcel(this.checkedValue).subscribe({
      next:(response : any)=>{
        console.log({'response':response});
        const blob = new Blob([response.body as Blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
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
  

  selectedRows: string[] = [];
  selectAll: boolean = false;

  

  handleRowSelect(id: string) {
    if (this.selectedRows.includes(id)) {
      this.selectedRows = this.selectedRows.filter(rowId => rowId !== id);
    } else {
      this.selectedRows = [...this.selectedRows, id];
    }
  }

  getStatusBadgeColor(type: boolean): 'success' | 'warning' | 'error' {
   // console.log({'type':type});
    if (type === true) return 'success';
    if (type === false) return 'error';
    return 'error';
  }


  selectedValue: string = 'option2';
  checkedValue: string = 'Active';

  handleRadioChange(value: string) {
    this.checkedValue = value;
    this.dataRow=[];
    this.getAgencies();
  }

  changeUserStatus(user:any){ 
    let confirmText = user.isActive ? 'Block this user and prevent future access?': 'Un Block this user?'
    if(confirm(confirmText)){
      this.agencyservice.putAuditorStatus(user).subscribe({
      next:(response:any)=>{        
       let row = this.dataRow.filter((f:any) => f.id==response.id);       
       this.dataRow = this.dataRow.filter((f:any) => f.id != response.id);
      this.successmessage=user.isActive ? 'User account blocked successfully.': 'User account unblocked successfully.';
      setTimeout(() => {
        this.successmessage='';
      }, 5000);

      }
    });    
    }
  }

}
