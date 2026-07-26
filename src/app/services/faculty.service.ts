import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APPURLs } from "../shared/constants/url.constants";
import { ApiService } from "../shared/services/api.service";

@Injectable({
    providedIn:'root'
})
export class FacultyService{

constructor(private http:HttpClient,private api: ApiService){
    
  }

getTrainerList(id:string){
  let query ="?id="+id;
   return this.api.getSimple(APPURLs.trainerlist+query);  
  }

  getFacultyList(id:string, orgCategory: number | null = null){
  let query ="?id="+id;
  if(orgCategory != null) query += "&orgCategory="+orgCategory;
   return this.api.getSimple(APPURLs.facultylist+query);
  }

  getRegistrationList(status: string, orgCategoryId?: number | null, orgSubCategoryId?: number | null) {
    let query = '?status=' + status;
    if (orgCategoryId) query += '&orgCategoryId=' + orgCategoryId;
    if (orgSubCategoryId) query += '&orgSubCategoryId=' + orgSubCategoryId;
    return this.api.getSimple(APPURLs.registrationlist + query);
  }

  exportRegistrations(status: string, orgCategoryId?: number | null, orgSubCategoryId?: number | null) {
    let query = '?status=' + status;
    if (orgCategoryId) query += '&orgCategoryId=' + orgCategoryId;
    if (orgSubCategoryId) query += '&orgSubCategoryId=' + orgSubCategoryId;
    return this.api.getTestFile(APPURLs.registrationexport + query);
  }

  updateRegistrationRecordStatus(statusDetail:any){    
   return this.api.putSimple(APPURLs.registrationstatuschange,statusDetail);  
  }

  getActiveIASList(){
   return this.api.getSimple(APPURLs.registrationlistias);  
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

  updateTrainerStatus(id:any,status:any){
      let query ='?id='+id+'&status='+status;
     return this.api.putSimple(APPURLs.trainerstatus+query,{id:id,status:status}); 
    
  }

  allocateTrainer(id:any,agency:any){
      let query ='?id='+id+'&agency='+agency;
     return this.api.postSimpleWithHeader(APPURLs.trainerassignment+query,{id:id,agency:agency}); 
    
  }

  unallocateTrainer(id:any,agency:any){
      let query ='?id='+id+'&agency='+agency;
     return this.api.postSimpleWithHeader(APPURLs.trainerunassignment+query,{id:id,agency:agency}); 
    
  }

  rejectProgrammeStatus(id:any,comment:any,status:any){
    return this.api.putSimple(APPURLs.qcstatuschangetoReject,{BatchId:id,Comment:comment,Status:status});
    
  }


  getCoordinatorsList(){  
   return this.api.getSimple(APPURLs.programmecoordinators);  
  }
  getActiveAgencyList(){  
   return this.api.getSimple(APPURLs.activeagencylist);  
  }

  getTrainerDetail(id:string){  
    let query ='?id='+id;
   return this.api.getSimple(APPURLs.trainerdetail+query);  
  }

  getAgencyAllotmentList(id:string){  
    let query ='?id='+id;
   return this.api.getSimple(APPURLs.trainerallotment+query);  
  }

  getLeadTrainersList(){  
   return this.api.getSimple(APPURLs.programmeleadTrainers);  
  }

  getLeadOrganisingParterList(){  
   return this.api.getSimple(APPURLs.programmeorganisingParter);  
  }

postFaculty(detail:any,file:any){
    return this.api.postWithFile(APPURLs.trainerpost,detail,file,'resume');  
}


  

}