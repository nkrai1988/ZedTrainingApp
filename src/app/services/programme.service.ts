import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APPURLs } from "../shared/constants/url.constants";
import { ApiService } from "../shared/services/api.service";

@Injectable({
    providedIn:'root'
})
export class ProgrammeService{

constructor(private http:HttpClient,private api: ApiService){
    
  }

getProgrammeList(centerId:string, orgCategory: string = ''){
  let query ="?centerId="+centerId;
  if(orgCategory){
    query += '&orgCategory=' + encodeURIComponent(orgCategory);
  }
   return this.api.getSimple(APPURLs.programmelist+query);
  }

  getTrainingProgrammeList(){  
   return this.api.getSimple(APPURLs.trainingprogrammelist);  
  }

registerAssessorsToBatch(data:any){
  return this.api.postSimple(APPURLs.trainingprogrammeenroll,data);
}

  getAdminProgrammeList(orgCategory: string = ''){
    let query = orgCategory ? '?orgCategory=' + encodeURIComponent(orgCategory) : '';
   return this.api.getSimple(APPURLs.programmenewlist + query);
  }

  getPlainProgrammeList(){
  
   return this.api.getSimple(APPURLs.programmelist);  
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

  updateProgrammeStatus(id:any,status:any){
    if(status == 3){
      let query ='?batchid='+id;
     return this.api.putSimple(APPURLs.qcstatuschangetoAprove+query,{batchid:id});  
    }
    else{
      return this.api.putSimple(APPURLs.qcstatuschangetoReject,{id:id,status:status});  
    }
    
  }

  exportToExcel(filters:any){    
    return this.api.getExceltFileWithFilterPost(APPURLs.programmeexport,filters);
}

  programmeexportToExcel(filters:any){    
    return this.api.getExceltFileWithFilterPost(APPURLs.programmeexport,filters);
}

  exportToExcelViewReport(ptype:string,agency:string){  
      let query ='?ptype='+ptype;
      if(agency){
        query  =query+"&agency="+agency;
      }
    return this.api.getTestFile(APPURLs.vewreportexport+query);
}

  approveProgramme(id:string){
    let query ='?id='+id;
    return this.api.putSimple(APPURLs.qcprogrammeapprove+query,{id:id}); 
  }


  rejectProgrammeStatus(id:any,comment:any){
    let query = '?id=' + id + '&comments=' + encodeURIComponent(comment);
    return this.api.putSimple(APPURLs.programmereject + query, {});
  }

  closeRegistration(batchNo: string) {
    return this.api.putSimple(APPURLs.programmeCloseRegistration + '?batchNo=' + encodeURIComponent(batchNo), {});
  }

  postponeProgramme(batchNo: string, comments: string) {
    return this.api.putSimple(APPURLs.programmePostpone + '?batchNo=' + encodeURIComponent(batchNo) + '&comments=' + encodeURIComponent(comments), {});
  }

  qcRejectProgramme(batchId:any, comment:any){
    return this.api.putSimple(APPURLs.qcstatuschangetoReject, {BatchId:batchId, Comment:comment});
  }


  getCoordinatorsList(){  
   return this.api.getSimple(APPURLs.programmecoordinators);  
  }
  getActiveAgencyList(orgCategory: string = ''){
    let query = orgCategory ? '?orgCategory=' + encodeURIComponent(orgCategory) : '';
   return this.api.getSimple(APPURLs.activeagencylist + query);
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

getViewReportList(ptype:string,agency:string){
  let query ='';//'?status='+status;
  if(ptype){
      query = query+'?ptype='+ptype;
  }

  if(agency){
      query =(query) ? query+'&agency='+agency : query+'?agency='+agency;
  }

   return this.api.getSimple(APPURLs.viewReportlist+query);
  }

  downloadBatchPdf(batchNo: string) {
    return this.api.getTestFile(`BatchDetail/pdftest?id=${batchNo}`);
  }




}