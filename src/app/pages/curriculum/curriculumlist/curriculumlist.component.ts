import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
import { DataloadinprogressComponent } from '../../../shared/components/common/dataloadinprogress/dataloadinprogress.component';
import { DatanotfoundComponent } from '../../../shared/components/common/datanotfound/datanotfound.component';


@Component({
  selector: 'app-curriculumlist',
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
    DatanotfoundComponent,
  ],
  templateUrl: './curriculumlist.component.html',
  styleUrl: './curriculumlist.component.css',
})
export class CurriculumlistComponent implements OnInit, OnDestroy {
  constructor(private service:CurriculumService,public modal: ModalService,public helperService:HelperService,private router:Router){
      
    }
      options = [
    { value: 'marketing', label: 'Marketing' },
    { value: 'template', label: 'Template' },
    { value: 'development', label: 'Development' },
  ];

    dataLoadProgress = false;
    isOpen = false;
    modelItem:any;
    programmetype='ZEDTP';
    programmename='';
    price='';
    newProgrammeclicked=false;
    orgCategoryId: number | null = null;
    orgCategoryName: string | null = null;
    orgSubCategoryId: number | null = null;
    private subscription: Subscription = new Subscription();
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
    programmetypeOptions:any=[];
    ngOnInit() {
      this.loadProgrammeType();

      this.subscription.add(
        this.helperService.category$.subscribe(val => {
          this.orgCategoryId = val;
          this.getCurriculum();
        })
      );
      this.subscription.add(
        this.helperService.categoryName$.subscribe(val => {
          this.orgCategoryName = val;
        })
      );
      this.subscription.add(
        this.helperService.subCategory$.subscribe(val => {
          this.orgSubCategoryId = val;
          this.getCurriculum();
        })
      );
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

    clearForm(){
      this.programmename='';
      this.price='';
      this.programmetype='ZEDTP';
      this.newProgrammeclicked=false;
    }

    getProgrammeTypeName(code: string): string {
      const map: Record<string, string> = {
        'ZEDTP': 'Training Programme',
        'ZEDAP': 'Awareness Programme',
        'ZAP':   'Awareness Programme',
        'ZTP':   'Training Programme',
      };
      if (!code) return '';
      for (const key of Object.keys(map)) {
        if (code.startsWith(key)) return map[key];
      }
      return code;
    }

    onDataSubmit(){
      this.newProgrammeclicked=true;
      if (!this.orgCategoryId) {
        this.errormessage = 'Organisation category is not available. Please re-login and try again.';
        setTimeout(() => { this.errormessage = ''; }, 5000);
        return;
      }
      if (!this.orgSubCategoryId) {
        this.errormessage = 'Please select a Sub Category from the top header dropdown before adding a curriculum.';
        setTimeout(() => { this.errormessage = ''; }, 5000);
        return;
      }
      if(this.programmename){
        this.newProgrammeclicked=false;
          this.service.postCurriculum({
            ProgrammeType: this.programmetype,
            ProgrammeName: this.programmename,
            Price: this.price,
            OrgCategory: this.orgCategoryName,
            OrgCategoryId: this.orgCategoryId,
            OrgSubCategoryId: this.orgSubCategoryId
          }).subscribe(
            {
              next:(response:any[])=>{
              this.successmessage ="New Curriculum added successfully.";
              this.clearForm();
              // Redirect
              this.getCurriculum();  
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
    console.log({'programmeTypes':programmeTypes});
    programmeTypes.forEach((element:any) => {
      this.programmetypeOptions.push({value:element.qpCode,label:element.qpName});
    });
  }

    handleSave() {
    
    this.service.putCurriculum({ProgrammeType:this.modelItem.programCode,ProgrammeName:this.modelItem.qpName,QPCode:this.modelItem.qpCode}).subscribe({
      next:(result:any)=>{
        console.log({result:result});
        this.modelItem=null;
        this.isOpen = false; 
        this.modal.closeModal();
        this.successmessage ="Curriculum updated successfully.";
        this.getCurriculum();  
                setTimeout(() => {
                  this.successmessage ='';
                
                }, 3000);
      },
      error:(err)=>{
        console.log({'err':err});
         this.modelItem=null;
        this.isOpen = false; 
        this.modal.closeModal();
         this.errormessage='Failed to update.';
      }
    })

    //this.modal.closeModal();
  }

    getCurriculum(){
    this.dataLoadProgress=true;
    this.service.getCurriculumList(this.checkedValue, this.orgCategoryId, this.orgSubCategoryId).subscribe({
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
