// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-certificateslist',
//   imports: [],
//   templateUrl: './certificateslist.component.html',
//   styleUrl: './certificateslist.component.css',
// })
// export class CertificateslistComponent {

// }
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
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
import { Router, RouterModule } from '@angular/router';
import { CurriculumService } from '../../../services/curriculum.service';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { HelperService } from '../../../services/helper.service';
import { CertificateService } from '../../../services/certificates.service';
import { DataloadinprogressComponent } from '../../../shared/components/common/dataloadinprogress/dataloadinprogress.component';
import { DatanotfoundComponent } from '../../../shared/components/common/datanotfound/datanotfound.component';


@Component({
  selector: 'app-certificateslist',
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
    LabelComponent,
    SelectComponent,
    DataloadinprogressComponent,
    DatanotfoundComponent
    
  ],
  templateUrl: './certificateslist.component.html',
  styleUrl: './certificateslist.component.css',
})
export class CertificateslistComponent implements OnInit, OnDestroy {
  constructor(private service:CertificateService,public modal: ModalService,private helperService:HelperService,private router:Router){

    }

  private currentCategoryId: number | null = null;
  private currentSubCategoryId: number | null = null;
  private subscription: Subscription = new Subscription();

    dataLoadProgress=false;
      options = [
    { value: 'marketing', label: 'Marketing' },
    { value: 'template', label: 'Template' },
    { value: 'development', label: 'Development' },
  ];
  
    isOpen = false;
    modelItem:any;
    programmetype='';
    programmename='';
    newProgrammeclicked=false;
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
    participantsdataRow:any=[];
    loadParticipants=false;
    selectedBatch:any;
    successmessage='';
    errormessage='';
    generatingId: any = null;
    programmetypeOptions:any=[];
    ngOnInit(){
      if (this.helperService.IsSuperAdmin()) {
        this.subscription.add(
          combineLatest([this.helperService.category$, this.helperService.subCategory$])
            .subscribe(([category, subCategory]) => {
              this.currentCategoryId = category;
              this.currentSubCategoryId = subCategory;
              this.getCertificate();
            })
        );
      } else if (this.helperService.IsCategoryAdmin()) {
        const stored = localStorage.getItem('user');
        if (stored) this.currentCategoryId = JSON.parse(stored)?.orgCategoryId ?? null;
        this.subscription.add(
          this.helperService.subCategory$.subscribe(subCategory => {
            this.currentSubCategoryId = subCategory;
            this.getCertificate();
          })
        );
      } else {
        const stored = localStorage.getItem('user');
        if (stored) {
          const u = JSON.parse(stored);
          this.currentCategoryId = u?.orgCategoryId ?? null;
          this.currentSubCategoryId = u?.selectedSubCategoryId ?? null;
        }
        this.getCertificate();
      }
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

    clearForm(){
      this.programmename='';
      this.programmetype='';
      this.newProgrammeclicked=false;
      
    }

    

  


    getCertificate(){
      this.loadParticipants=true;
    this.service.getCertificateList(this.currentCategoryId, this.currentSubCategoryId).subscribe({
      next:(response:any[])=>{        
        this.dataRow = response;
        this.loadParticipants=false;
      },
      error:(err:any)=>{
        this.loadParticipants=false;
      }
    });    
  }

    getPaticipants(row:any){
      this.selectedBatch=row;
    this.service.getParticipantsList(row.programmeID).subscribe({
      next:(response:any[])=>{
        console.log({'participants':response});
        this.participantsdataRow=response;
        this.loadParticipants=true;
      }
    });    
  }

    getCertificateDetail(row:any){
    this.errormessage='';
    this.generatingId = row.id;
    this.service.generateCertificate(this.selectedBatch.programmeID, row.id).subscribe({
      next:(_res:any)=>{
        this.service.downloadCertificate(this.selectedBatch.programmeID, row.id).subscribe({
          next:(response:any)=>{
            this.generatingId = null;
            const blob = response.body as Blob;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.selectedBatch.programmeID}_${row.id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
          },
          error:(_err:any)=>{
            this.generatingId = null;
            this.errormessage='Failed to download certificate.';
          }
        });
      },
      error:(err:any)=>{
        this.generatingId = null;
        this.errormessage = err?.error?.message || 'Failed to generate certificate.';
      }
    });
  }

  backToProgramme(){
    this.loadParticipants=false;
    this.participantsdataRow=[];
  }

   getCurriculum(){
    this.service.getCurriculumList(this.checkedValue).subscribe({
      next:(response:any[])=>{
        console.log({'response999':response});
        //let all=response.map(x=> ({value:x,label:x}));
        this.dataRow = response;
      }
    });    
  }

  gotoResults(row:any){
    
  }

  

  selectedRows: string[] = [];
  selectAll: boolean = false;

  handleSelectAll(value:any) {
    console.log({'value':value});    
    this.programmetype=value;
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
    this.getCurriculum();
  }

  gotosession(row:any){
    console.log({'row':row});
    this.router.navigate(['/sessions'],{queryParams:{qpcode:row.qpCode}}); 
  }

  changeUserStatus(user:any){ 
    let confirmText = user.isActive ? 'Block this Curriculum?': 'Un Block this Curriculum?'
    if(confirm(confirmText)){
      this.service.putCurriculumStatus(user).subscribe({
      next:(response:any)=>{        
       let row = this.dataRow.filter((f:any) => f.id==response.id);       
       this.dataRow = this.dataRow.filter((f:any) => f.id != response.id);
      this.successmessage=user.isActive ? 'Curriculum blocked successfully.': 'Curriculum unblocked successfully.';
      setTimeout(() => {
        this.successmessage='';
      }, 5000);

      }
    });    
    }
  }

}
