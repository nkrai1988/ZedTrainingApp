// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-organising-partners',
//   imports: [],
//   templateUrl: './organising-partners.component.html',
//   styleUrl: './organising-partners.component.css',
// })
// export class OrganisingPartnersComponent {

// }



import { Component } from '@angular/core';
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
import { organisingpartnerService } from '../../../services/organisingpartner.service';
import { HelperService } from '../../../services/helper.service';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { DataloadinprogressComponent } from '../../../shared/components/common/dataloadinprogress/dataloadinprogress.component';
import { DatanotfoundComponent } from '../../../shared/components/common/datanotfound/datanotfound.component';


@Component({
  selector: 'app-organising-partners',
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
    DataloadinprogressComponent,
    DatanotfoundComponent
    
  ],
  templateUrl: './organising-partners.component.html',
  styleUrl: './organising-partners.component.css',
})
export class OrganisingPartnersComponent {
  constructor(private service:organisingpartnerService,public modal: ModalService,private helperService:HelperService){
      
    }
    dataLoadProgress=false;
    isOpen = false;
    modelItem:any;
    neworganizer:any;
    neworganizerclicked=false;
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
    errormessage='';
    ngOnInit(){
      this.getOPartners();
    }

    clearOpartner(){
      this.neworganizer='';
      this.neworganizerclicked=false;
    }

    createNewOPartner(){
      this.neworganizerclicked=true;
      console.log(this.neworganizer);
      if(this.neworganizer){
        this.neworganizerclicked=false;
          this.service.postOP({newPartner:this.neworganizer, orgCategory:this.helperService.masterOrgCategory}).subscribe(
            {
              next:(response:any[])=>{
              this.successmessage ="New Partner added successfully.";
              // Redirect
              this.getOPartners();  
                setTimeout(() => {
                  this.successmessage ='';
                
                }, 3000);
                
               },
               error:(err:any)=>{
                this.errormessage='Failed to add the new partner.';//+err.error;//error.message;
                  setTimeout(() => {
                    this.errormessage='';
                  }, 3000);
               }
            }
          );
      }
    }

    handleSave() {
    // Handle save logic here
    console.log('Saving changes...');
    this.modal.closeModal();
  }

    getOPartners(){
    this.dataLoadProgress=true;
    this.service.getOrganisingPartnerList().subscribe({
      next:(response:any[])=>{        
        this.dataRow = response;
        this.dataLoadProgress=false;
      },
      error:(err:any)=>{
        this.dataLoadProgress=false;
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
  checkedValue: string = 'Blocked';

  handleRadioChange(value: string) {
    this.checkedValue = value;
    this.dataRow=[];
    this.getOPartners();
  }

  changeUserStatus(user:any){ 
    let confirmText = user.isActive ? 'Block this user and prevent future access?': 'Un Block this user?'
    if(confirm(confirmText)){
      this.service.putAuditorStatus(user).subscribe({
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

