import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APPURLs } from "../shared/constants/url.constants";
import { ApiService } from "../shared/services/api.service";

@Injectable({
    providedIn:'root'
})
export class SessionsService{

constructor(private http:HttpClient,private api: ApiService){
    
}

getSessionList(qpcode:string){
  let query ="?qpcode="+qpcode;
   return this.api.getSimple(APPURLs.sessionlist+query);  
  }

  getTopicList(qpcode:string,noscode:string){
  let query ="?qpcode="+qpcode+"&noscode="+noscode;
   return this.api.getSimple(APPURLs.topiclist+query);  
  }


  getAgencyDetail(userid:string){
  let query ="?userid="+userid;
   return this.api.getSimple(APPURLs.agencydetail+query);  
  }

postSession(detail:any){
    return this.api.postSimpleWithHeader(APPURLs.sessionPost,detail);  
}

postTopic(detail:any){
    return this.api.postSimpleWithHeader(APPURLs.topicAdd,detail);  
}

putSession(detail:any){
    return this.api.putSimple(APPURLs.sessionEdit,detail);  
}

editTopic(detail:any){
    return this.api.putSimple(APPURLs.topicEdit,detail);  
}

editAgency(detail:any){
    return this.api.postSimpleWithHeader(APPURLs.sessionEdit,detail);  
}


putCurriculumStatus(body:any) {
   let query ="?id="+body.id;
   return this.api.putSimple(APPURLs.curriculumstatuschange+query,body)
} 

}