

import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';

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
import { CoordinatorService } from '../../../services/coordinator.service';
import { HelperService } from '../../../services/helper.service';
import { DataloadinprogressComponent } from '../../../shared/components/common/dataloadinprogress/dataloadinprogress.component';
import { DatanotfoundComponent } from '../../../shared/components/common/datanotfound/datanotfound.component';


@Component({
  selector: 'app-coordinatorlist',
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
  templateUrl: './coordinatorlist.component.html',
  styleUrl: './coordinatorlist.component.css',
})
export class CoordinatorlistComponent implements OnDestroy {
  private categorySub: Subscription = new Subscription();

  constructor(private coordinatorservice:CoordinatorService,public modal: ModalService,private helperService:HelperService){

    }
    dataLoadProgress=false;
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
    successmessage='';
    orgCategory='';
    ngOnInit(){
      if (this.helperService.IsMasterAdmin()) {
        this.categorySub = this.helperService.category$.subscribe(cat => {
          this.orgCategory = cat;
          this.dataRow = [];
          this.getAgencies();
        });
      } else {
        this.orgCategory = this.helperService.getOrgCategory() || '';
        console.log({'this.helperService.masterOrgCategory':this.helperService.masterOrgCategory});
        console.log({'this.orgCategory':this.orgCategory});
        this.getAgencies();
      } 
      // else {
      //   this.getAgencies();
      // }
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
    this.coordinatorservice.getAgencyList(this.checkedValue, this.orgCategory).subscribe({
      next:(response:any[])=>{
        this.dataRow = response;
        this.dataLoadProgress=false;
      },
      error:(err:any)=>{this.dataLoadProgress=false;}
    });    
  }

  selectedRows: string[] = [];
  selectAll: boolean = false;

  exportExcel(){
    
    this.coordinatorservice.exportToExcel(this.checkedValue).subscribe({
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

  

  handleRowSelect(id: string) {
    if (this.selectedRows.includes(id)) {
      this.selectedRows = this.selectedRows.filter(rowId => rowId !== id);
    } else {
      this.selectedRows = [...this.selectedRows, id];
    }
  }

  getBadgeColor(type: string): 'success' | 'warning' | 'error' {
    if (type === 'Complete') return 'success';
    if (type === 'Pending') return 'warning';
    return 'error';
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
      this.coordinatorservice.putAuditorStatus(user).subscribe({
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
