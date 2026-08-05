// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-topiclist',
//   imports: [],
//   templateUrl: './topiclist.component.html',
//   styleUrl: './topiclist.component.css',
// })
// export class TopiclistComponent {

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
import { Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CurriculumService } from '../../../services/curriculum.service';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { HelperService } from '../../../services/helper.service';
import { SessionsService } from '../../../services/sessions.service';


@Component({
  selector: 'app-topiclist',
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
  templateUrl: './topiclist.component.html',
  styleUrl: './topiclist.component.css',
})
export class TopiclistComponent {
  constructor(private service:SessionsService,public modal: ModalService,private helperService:HelperService,private activatedRoute:ActivatedRoute,private location:Location){

    }

  goBack() { this.location.back(); }

  get isCategoryAdmin(): boolean { return this.helperService.IsCategoryAdmin(); }

    isOpen = false;
    modelItem:any;
    programmetype='';
    topicname='';
    editSessionName='';
    newProgrammeclicked=false;

  openModal(row:any) {
     this.modelItem=row;
     console.log({'modelItem':this.modelItem});
     this.editSessionName=this.modelItem.pcName;
     this.isOpen = true;
     }

  closeModal() { 
    this.modelItem=null;
    this.isOpen = false; 
  }
    dataRow:any=[];
    successmessage='';
    errormessage='';
    qpcode='';
    noscode=''
    programmetypeOptions:any=[];
    ngOnInit(){

    this.activatedRoute.queryParams.subscribe(params => {      
      if(params['qpcode'] && params['noscode']){
         this.qpcode = params['qpcode'];
         this.noscode = params['noscode'];      
      this.getSessionTopics(this.qpcode,this.noscode);
      }
    });
      
      this.loadProgrammeType();
    }

    clearForm(){
      this.topicname='';
      this.programmetype='';
      this.newProgrammeclicked=false;
      
    }

    onDataSubmit(){
      this.newProgrammeclicked=true;
      if(this.topicname){
        this.newProgrammeclicked=false;
          this.service.postTopic({QpCode:this.qpcode,NosCode:this.noscode,PcName:this.topicname}).subscribe(
            {
              next:(response:any[])=>{
              this.successmessage ="New Topic added successfully.";
              this.clearForm();
              // Redirect
              this.getSessionTopics(this.qpcode,this.noscode);
                setTimeout(() => {
                  this.successmessage ='';
                }, 3000);
               },
               error:(err:any)=>{
                console.log({'err':err});
                this.errormessage= (err.error) ? err.error : 'Failed to add the new Topic.';//+err.error;//error.message;
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
    this.service.editTopic({NosId:this.modelItem.id,PcName:this.editSessionName,NosName:this.editSessionName}).subscribe({
      next:(result:any)=>{
        
        this.modelItem=null;
        this.editSessionName=''
        this.isOpen = false; 
        this.modal.closeModal();
        this.successmessage ="Topic Name Updated successfully.";
        this.getSessionTopics(this.qpcode,this.noscode);
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

    getSessionTopics(qpCode:string,nosCode:string){
    this.service.getTopicList(qpCode,nosCode).subscribe({
      next:(response:any[])=>{
        this.dataRow = response;
      }
    });    
  }
  
}
