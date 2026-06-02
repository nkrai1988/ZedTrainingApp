import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APPURLs } from "../shared/constants/url.constants";
import { ApiService } from "../shared/services/api.service";

@Injectable({
    providedIn:'root'
})
export class CurriculumService{

constructor(private http:HttpClient,private api: ApiService){
    
  }

getCurriculumList(status: string, orgCategory: string = '') {
  let query = "?status=" + status;
  if (orgCategory) query += "&orgCategory=" + orgCategory;
  return this.api.getSimple(APPURLs.curriculumlist + query);
}

  getAgencyDetail(userid:string){
  let query ="?userid="+userid;
   return this.api.getSimple(APPURLs.agencydetail+query);  
  }

postCurriculum(detail:any){
    return this.api.postSimpleWithHeader(APPURLs.curriculumnpost,detail);  
}

putCurriculum(detail:any){
    return this.api.putSimple(APPURLs.curriculumnupdate,detail);  
}

editAgency(detail:any){
    return this.api.postSimpleWithHeader(APPURLs.agencyedit,detail);  
}


putCurriculumStatus(body:any) {
   let query ="?id="+body.id;
   return this.api.putSimple(APPURLs.curriculumstatuschange+query,body)
}


  

}