

import { Component } from '@angular/core';
import { EcommerceMetricsComponent } from '../../../shared/components/ecommerce/ecommerce-metrics/ecommerce-metrics.component';
import { DemographicCardComponent } from '../../../shared/components/ecommerce/demographic-card/demographic-card.component';

import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { HelperService } from '../../../services/helper.service';


@Component({
  selector: 'app-dashboard',
  imports: [
    EcommerceMetricsComponent,
    DemographicCardComponent,
    SelectComponent,
    LabelComponent,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  constructor(private dashboardservice:DashboardService,private helper:HelperService){
    
  }

allstates:any=[];
locationData:any[]=[];

tempuser={userId:3};


  ngOnInit(){ 
      this.getStates();
      this.getProgrammes();
      this.getProgrammeCount();
  }
  
programeType:any[]=[];
// [
//     { value: 'all', label: 'All' },
//     { value: 'Industry Awareness Programme', label: 'ZEDAP' },
//     { value: 'Training Programme', label: 'ZEDTP' },
//   ];
  stateSelectedValue = 'All';
  selectedValue = 'All';
  selectedQPValue = 'All';
  ProgrammeNumber=0;
  ParticipantNumber=0;
  loadMap=false;
  dataLoadProgress=false;
  handleStateSelectChange(value: string) {
    this.stateSelectedValue = value;    
    this.getProgrammeCount();
  }

  handleProgrammeSelectChange(value: string) {
    this.selectedValue = value;    
    this.getProgrammeCount();
  }

  handleQPProgrammeSelectChange(value: string) {
    this.selectedQPValue = value;    
    this.getProgrammeCount();
  }
  
  getStates(){
    this.dashboardservice.getStateData().subscribe({
      next:(response:string[])=>{ 
        this.allstates=[];       
        this.allstates=response.map(x=> ({value:x,label:x}));
        this.allstates.unshift({value:'All',label:'All'});
      }
    });
    
  }

  

  getProgrammes(){
    console.log({'this.helper.IsSuperAdmin()':this.helper.IsMasterAdmin()});
    if(this.helper.IsMasterAdmin()){
        let options = this.helper.superMasterAdminTrainingProgrammeOptions();
        
        this.programeType=options.map((x:any)=> ({value:x.value,label:x.label}));
        this.programeType.unshift({value:'All',label:'All'});
    }
    else{
      this.dashboardservice.getProgrammeOption().subscribe({
        next:(response:any[])=>{  
          this.programeType=[];  
          this.programeType=response.map(x=> ({value:x.qpCode,label:x.qpName}));
          this.programeType.unshift({value:'All',label:'All'});
        }
    });
    }
    
  }

  

  getProgrammeCount(){
    this.locationData=[];
    this.loadMap=false;
    this.dataLoadProgress=true;
    this.ProgrammeNumber=0;
  this.ParticipantNumber=0;
    this.dashboardservice.getProgrammeCountOption(this.stateSelectedValue,this.selectedValue,this.selectedQPValue).subscribe({
      next:(response:any[])=>{  
        this.ProgrammeNumber=response.length;
        this.ParticipantNumber=response.reduce((sum, p) => sum + p['noOfRegistrations'], 0);
        this.locationData=response;//.map(x=> ({value:x.qpCode,label:x.qpName}));
        this.loadMap=true;
        this.dataLoadProgress=false;
      },
      error:(err:any)=>{
        this.loadMap=true;
        this.dataLoadProgress=false;
      }
    })
  }

  


}

