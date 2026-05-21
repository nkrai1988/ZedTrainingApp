import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APPURLs } from "../shared/constants/url.constants";
import { ApiService } from "../shared/services/api.service";

@Injectable({
    providedIn:'root'
})
export class ReportService{

constructor(private http:HttpClient,private api: ApiService){
    
  }

getProgrammeList(centerId:string){
  let query ="?centerId="+centerId;
   return this.api.getSimple(APPURLs.programmelist+query);  
  }

getCurriculumList(ptype:string){
  let query ="?ptype="+ptype;
   return this.api.getSimple(APPURLs.reportcurriculum+query);  
  }


  getQCApprovalList(ptype:string,status:string,agency:string){
  let query ='?status='+status;
  if(ptype){
      query = query+'&ptype='+ptype;
  }

  if(agency){
      query = query+'&agency='+agency;
  }

   return this.api.getSimple(APPURLs.qcapprovallist+query);  
  }
  
getSummaryReport(){//(ptype:string,state:string,agency:string,curriculum:string){
  // let query ='?status='+status;
  // if(ptype){
  //     query = query+'&ptype='+ptype;
  // }

  // if(agency){
  //     query = query+'&agency='+agency;
  // }

   return this.api.getSimple(APPURLs.programmesummarylist);  
  }

  updateProgrammeStatus(id:any,status:any){
    if(status == 3){
      let query ='?batchid='+id;
     return this.api.putSimple(APPURLs.qcstatuschangetoAprove+query,{batchid:id});  
    }
    else{
      return this.api.putSimple(APPURLs.qcstatuschangetoReject,{id:id,status:status});  
    }
    
  }

  rejectProgrammeStatus(id:any,comment:any,status:any){
    return this.api.putSimple(APPURLs.qcstatuschangetoReject,{BatchId:id,Comment:comment,Status:status});
    
  }

    exportToExcel(filters:any){    
      return this.api.getExceltFileWithFilterPost(APPURLs.summaryexport,filters);
  }


  getCoordinatorsList(){  
   return this.api.getSimple(APPURLs.programmecoordinators);  
  }
  getActiveAgencyList(){  
   return this.api.getSimple(APPURLs.activeagencylist);  
  }

  getLeadTrainersList(){  
   return this.api.getSimple(APPURLs.programmeleadTrainers);  
  }

  getLeadOrganisingParterList(){  
   return this.api.getSimple(APPURLs.programmeorganisingParter);  
  }

  postNewProgramme(detail:any){
    return this.api.postSimpleWithHeader(APPURLs.newProgrameePost,detail);  
}

getProgrammeOption(){
   return this.api.getSimple(APPURLs.programmeprogrammes);
  }




  

}