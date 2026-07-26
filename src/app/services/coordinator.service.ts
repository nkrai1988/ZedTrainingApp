import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APPURLs } from "../shared/constants/url.constants";
import { ApiService } from "../shared/services/api.service";

@Injectable({
    providedIn:'root'
})
export class CoordinatorService{

constructor(private http:HttpClient,private api: ApiService){
    
  }

getAgencyList(status:string, orgCategory: number | null = null){
  let query ="?status="+status;
  if(orgCategory != null) query += "&orgCategory="+orgCategory;
   return this.api.getSimple(APPURLs.coordinatorlist+query);
  }

  exportToExcel(activeorblocked:string){
    let query='?isactive='+(activeorblocked =='Active' ? true:false);
    return this.api.getTestFile(APPURLs.coordinatorexport+query);
}

  getAgencyDetail(userid:string){
  let query ="?userid="+userid;
   return this.api.getSimple(APPURLs.agencydetail+query);  
  }

postAgency(detail:any){
    return this.api.postSimpleWithHeader(APPURLs.coordinatorpost,detail);
}

editAgency(detail:any){
    return this.api.postSimpleWithHeader(APPURLs.agencyedit,detail);  
}


putAuditorStatus(body:any) {
   // return this.http.post(APPURLs.base+APPURLs.login, body);
   return this.api.putSimple(APPURLs.agencystatus,body)
}


  

}