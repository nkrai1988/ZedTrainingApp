import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APPURLs } from "../shared/constants/url.constants";
import { ApiService } from "../shared/services/api.service";

@Injectable({
    providedIn:'root'
})
export class CertificateService{

constructor(private http:HttpClient,private api: ApiService){
    
  }

getCertificateList(orgCategoryId: number | null = null, orgSubCategoryId: number | null = null){
    let query = '';
    if (orgCategoryId) query += '?orgCategoryId=' + orgCategoryId;
    if (orgSubCategoryId) query += (query ? '&' : '?') + 'orgSubCategoryId=' + orgSubCategoryId;
    return this.api.getSimple(APPURLs.certificateslist + query);
}

getCertificateDetail(batchid:string,participantid:string){
    let query ="?programmeId="+batchid+"&participantId="+participantid;
    return this.api.getSimple(APPURLs.certificatedetail+query);
}

generateCertificate(programmeId:string, participantId:string){
    let query = "?programmeId="+programmeId+"&participantId="+participantId;
    return this.api.postSimpleWithHeader(APPURLs.certificateGenerate+query, {});
}

downloadCertificate(batchNo:string, participantId:string){
    let query = "?batchNo="+batchNo+"&participantId="+participantId;
    return this.api.getTestFile(APPURLs.certificateDownload+query);
}

verifyCertificate(id: string){
    return this.api.getPublic(APPURLs.certificateVerify+'/'+id);
}

getParticipantsList(batchid:string){
    let query ="?programmeId="+batchid;
    return this.api.getSimple(APPURLs.participantslist+query);  
}

getCurriculumList(status:string){
  let query ="?status="+status;
   return this.api.getSimple(APPURLs.curriculumlist+query);  
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