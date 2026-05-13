import { Component } from '@angular/core';
import { StatisticsChartComponent } from '../../../shared/components/ecommerce/statics-chart/statics-chart.component';
import { RecentOrdersComponent } from '../../../shared/components/ecommerce/recent-orders/recent-orders.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-ecommerce',
  imports: [
    StatisticsChartComponent,
    RecentOrdersComponent,
    CommonModule
  ],
  templateUrl: './ecommerce.component.html',
})
export class EcommerceComponent {
  constructor(private http:HttpClient){
    console.log('constructor');
  }

allstates:any=[];
locationData:any[]=[];

tempuser={userId:3};


  ngOnInit(){ 
    // let token= localStorage.getItem('authToken');
    // console.log({token:token});
    // if(token){
    //   this.getStates();
    //   this.getProgrammes();
    //   this.getProgrammeCount()
    // }
  }
  
programeType = [
    { value: 'all', label: 'All' },
    { value: 'Industry Awareness Programme', label: 'ZEDAP' },
    { value: 'Training Programme', label: 'ZEDTP' },
  ];
  stateSelectedValue = '';
  selectedValue = '';
  ProgrammeNumber=0;
  ParticipantNumber=0;
  loadMap=false;
  handleStateSelectChange(value: string) {
    this.stateSelectedValue = value;
    console.log('Selected value:', value);
    this.getProgrammeCount();
  }

  handleProgrammeSelectChange(value: string) {
    this.selectedValue = value;
    console.log('Selected value:', value);
    this.getProgrammeCount();
  }
  
  getStates(){
    this.getStateData().subscribe({
      next:(response:string[])=>{ 
        this.allstates=[];       
        this.allstates=response.map(x=> ({value:x,label:x}));
        this.allstates.unshift({value:'All',label:'All'});
      }
    })
  }

  getStateData(){
   let token= localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': 'Bearer '+token,
    'Content-Type': 'application/json'
  });
  
   return this.http.get<string []>('https://localhost:7161/api/dashboard/states',{headers});
  }

  getProgrammes(){
    this.getProgrammeOption().subscribe({
      next:(response:any[])=>{  
        this.programeType=[];  
        this.programeType=response.map(x=> ({value:x.qpCode,label:x.qpName}));
        this.programeType.unshift({value:'All',label:'All'});
      }
    })
  }

  getProgrammeOption(){
   let token= localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': 'Bearer '+token,
    'Content-Type': 'application/json'
  });
  
   return this.http.get<any []>('https://localhost:7161/api/dashboard/programmes',{headers});
  }

  getProgrammeCount(){
    this.locationData=[];
    this.loadMap=false;
    this.getProgrammeCountOption().subscribe({
      next:(response:any[])=>{  
        this.ProgrammeNumber=response.length;
        this.ParticipantNumber=response.reduce((sum, p) => sum + p['noOfRegistrations'], 0);
        this.locationData=response;//.map(x=> ({value:x.qpCode,label:x.qpName}));
        this.loadMap=true;
      }
    })
  }

  getProgrammeCountOption(){
  this.ProgrammeNumber=0;
  this.ParticipantNumber=0;
   let token= localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': 'Bearer '+token,
    'Content-Type': 'application/json'
  });
  let query=''
  if(this.stateSelectedValue){
    query='?';
    query+='state='+this.stateSelectedValue;
  }

  if(this.selectedValue){
    if(query.length){
      query+='&programme='+this.selectedValue;
    }
    else{
      query='?';
      query+='&programme='+this.selectedValue;
    }
    
  }
  
   return this.http.get<any []>('https://localhost:7161/api/dashboard/batches'+query,{headers});
  }


}
