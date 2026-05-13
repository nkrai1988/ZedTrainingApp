

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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { HelperService } from '../../../services/helper.service';
import { SessionsService } from '../../../services/sessions.service';


@Component({
  selector: 'app-sessionlist',
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
    SelectComponent    
  ],
  templateUrl: './sessionlist.component.html',
  styleUrl: './sessionlist.component.css',
})
export class SessionlistComponent {
  constructor(private service:SessionsService,public modal: ModalService,private helperService:HelperService,private activeroute:ActivatedRoute,private route:Router){
      
    }

    isOpen = false;
    modelItem:any;
    programmetype='';
    sessionname='';
    editSessionName='';
    newProgrammeclicked=false;

  openModal(row:any) {
     this.modelItem=row;     
     this.editSessionName=this.modelItem.nosName;
     this.isOpen = true;
     }

  closeModal() { 
    this.modelItem=null;
    this.isOpen = false; 
  }
    qpcode='';
    dataRow:any=[];
    successmessage='';
    errormessage='';
    programmetypeOptions:any=[];
    ngOnInit(){
      this.activeroute.queryParams.subscribe(params => {      
      if(params['qpcode']){
         this.qpcode = params['qpcode'];      
        this.getSessions(this.qpcode);
      }
    });  
      
      this.loadProgrammeType();
    }

    clearForm(){
      this.sessionname='';
      this.programmetype='';
      this.newProgrammeclicked=false;
    }

    gotoTopics(row:any){
      this.route.navigate(['topics'],{queryParams:{qpcode:row.qpCode,noscode:row.nosCode}})
    }

    onDataSubmit(){
      this.newProgrammeclicked=true;
      console.log(this.sessionname,this.qpcode);
      
      if(this.sessionname && this.qpcode){
        this.newProgrammeclicked=false;
          this.service.postSession({QpCode:this.qpcode,NosName:this.sessionname}).subscribe(
            {
              next:(response:any[])=>{
              this.successmessage ="New Session added successfully.";
              this.clearForm();
              // Redirect
              this.getSessions(this.qpcode);  
                setTimeout(() => {
                  this.successmessage ='';
                }, 3000);
               },
               error:(err:any)=>{
                console.log({'err':err});
                this.errormessage= (err.error) ? err.error : 'Failed to add the new Curriculumn.';//+err.error;//error.message;
                  setTimeout(() => {
                    this.errormessage='';
                  }, 3000);
               }
            }
          );
      }
    }

    loadProgrammeType(){
    let programmeTypes= this.helperService.getUserTraingProgrammeswithValue();    
    programmeTypes.forEach((element:any) => {
      this.programmetypeOptions.push({value:element.qpCode,label:element.qpName});
    });
  }

    handleSave() {    
    this.service.putSession({NosId:this.modelItem.nosId,NosName:this.editSessionName}).subscribe({
      next:(result:any)=>{
        console.log({result:result});
        this.modelItem=null;
        this.editSessionName=''
        this.isOpen = false; 
        this.modal.closeModal();
        this.successmessage ="Session Name Updated successfully.";
        this.getSessions(this.qpcode);  
                setTimeout(() => {
                  this.successmessage ='';                
                }, 3000);
      },
      error:(err:any)=>{
        
        this.modelItem=null;
        this.isOpen = false; 
        this.modal.closeModal();
        this.errormessage='Failed to update.';
      }
    });
    
  }

    getSessions(qpcode:string){
    this.service.getSessionList(qpcode).subscribe({
      next:(response:any[])=>{
        this.dataRow = response;
      }
    });    
  }

  selectedRows: string[] = [];
  selectAll: boolean = false;

  handleSelectAll(value:any) {
    this.programmetype=value;
  }

  handleRowSelect(id: string) {
    if (this.selectedRows.includes(id)) {
      this.selectedRows = this.selectedRows.filter(rowId => rowId !== id);
    } else {
      this.selectedRows = [...this.selectedRows, id];
    }
  }
}
