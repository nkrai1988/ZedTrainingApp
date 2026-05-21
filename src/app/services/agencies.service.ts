import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APPURLs } from "../shared/constants/url.constants";
import { ApiService } from "../shared/services/api.service";

@Injectable({
    providedIn:'root'
})
export class AgencyService{

constructor(private http:HttpClient,private api: ApiService){
    
  }

getAgencyList(status:string){
  let query ="?status="+status;
   return this.api.getSimple(APPURLs.agencylist+query);  
  }

exportToExcel(activeorblocked:string){
    let query='?isactive='+(activeorblocked =='Active' ? true:false);
    //return this.api.getSimpleFile(APPURLs.agencyexport+query);
    return this.api.getTestFile(APPURLs.agencynewexport+query);
}

  getAgencyDetail(userid:string){
  let query ="?userid="+userid;
   return this.api.getSimple(APPURLs.agencydetail+query);  
  }

postAgency(detail:any){
    return this.api.postSimpleWithHeader(APPURLs.agencypost,detail);  
}

editAgency(detail:any){
    return this.api.postSimpleWithHeader(APPURLs.agencyedit,detail);  
}


putAuditorStatus(body:any) {
   // return this.http.post(APPURLs.base+APPURLs.login, body);
   return this.api.putSimple(APPURLs.agencystatus,body)
}


  

}