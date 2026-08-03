

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
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  constructor(private dashboardservice:DashboardService,private helper:HelperService){
    
  }

allstates: any[] = [];
locationData: any[] = [];

programmeTypeOptions = [
  { value: 'All',   label: 'All Available Programmes' },
  { value: 'ZEDTP', label: 'ZED Training Programme' },
  { value: 'ZEDAP', label: 'ZED Awareness Programme' },
];

ngOnInit() {
  this.getStates();
  this.getProgrammeCount();
}

stateSelectedValue = 'All';
programmeTypeSelectedValue = 'All';
selectedQPValue = 'All';
ProgrammeNumber = 0;
ParticipantNumber = 0;
AgencyNumber = 0;
CertifiedExpertsNumber = 0;
loadMap = false;
dataLoadProgress = false;

applyFilters() {
  this.getProgrammeCount();
}

handleStateSelectChange(value: string) {
  this.stateSelectedValue = value;
}

handleProgrammeTypeChange(value: string) {
  this.programmeTypeSelectedValue = value;
}

get selectedValue(): string {
  return this.programmeTypeSelectedValue === 'All' ? 'ZEDTP' : this.programmeTypeSelectedValue;
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

