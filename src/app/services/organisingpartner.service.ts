import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APPURLs } from "../shared/constants/url.constants";
import { ApiService } from "../shared/services/api.service";

@Injectable({
    providedIn:'root'
})
export class organisingpartnerService{

constructor(private http:HttpClient,private api: ApiService){
    
  }

getOrganisingPartnerList(){  
   return this.api.getSimple(APPURLs.organisingpartner);  
  }

  getAgencyDetail(userid:string){
  let query ="?userid="+userid;
   return this.api.getSimple(APPURLs.agencydetail+query);  
  }

postOP(detail:any){
    let query ="?newPartner="+detail.newPartner+"&orgCategory="+detail.orgCategory;
    return this.api.postSimpleWithHeader(APPURLs.organisingpartnerPOST+query,detail);
}

editAgency(detail:any){
    return this.api.postSimpleWithHeader(APPURLs.agencyedit,detail);  
}


putAuditorStatus(body:any) {
   // return this.http.post(APPURLs.base+APPURLs.login, body);
   return this.api.putSimple(APPURLs.agencystatus,body)
}


  

}