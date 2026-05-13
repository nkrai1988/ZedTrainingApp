import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APPURLs } from "../shared/constants/url.constants";
import { ApiService } from "../shared/services/api.service";

@Injectable({
    providedIn:'root'
})
export class DashboardService{

constructor(private http:HttpClient,private api: ApiService){
    
  }

getStateData(){
return this.api.getSimple(APPURLs.dashboardStateOption);  
  }


  getProgrammeOption(){
   return this.api.getSimple(APPURLs.dashboardProgrammeOption);
  }

  getProgrammeCountOption(stateSelectedValue:any,selectedValue:any,qpvalue:any){  
  
  let query=''
  if(stateSelectedValue){
    query='?';
    query+='state='+stateSelectedValue;
  }

  if(selectedValue && selectedValue !='All'){
    if(query.length){
      query+='&programme='+selectedValue;
    }
    else{
      query='?';
      query+='&programme='+selectedValue;
    }    
  }

  if(qpvalue && qpvalue != 'All'){
    if(query.length){
      query+='&qpcode='+qpvalue;
    }
    else{
      query='?';
      query+='&qpcode='+qpvalue;
    }    
  }


   return this.api.getSimple(APPURLs.dashboardCountLocation+query);
  }

}