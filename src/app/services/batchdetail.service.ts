import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APPURLs } from "../shared/constants/url.constants";
import { ApiService } from "../shared/services/api.service";

@Injectable({
    providedIn:'root'
})
export class BatchDetailService{

constructor(private http:HttpClient,private api: ApiService){
    
  }



getBatchVenue(batchid:string){
    let query="?batchid="+batchid;
    return this.api.getSimple(APPURLs.batchdetailVenue+query);
}

getBatchMonitoringList(batchid:string){
    let query="?batchid="+batchid;
    return this.api.getSimple(APPURLs.batchdetailMonitoring+query);
}

getBatchTrainerList(batchid:string){
    let query="?batchid="+batchid;
    return this.api.getSimple(APPURLs.batchdetailTrainers+query);
}

getBatchFeedbacksList(batchid:string){
    let query="?batchid="+batchid;
    return this.api.getSimple(APPURLs.batchdetailFeedback+query);
}

getBatchAttendanceList(batchid:string){
    let query="?batchid="+batchid;
    return this.api.getSimple(APPURLs.batchdetailAttendance+query);
}

getBatchParticipantList(batchid:string){
    let query="?batchid="+batchid;
    return this.api.getSimple(APPURLs.batchdetailParticipants+query);
}

getBatchAttendancePhotoList(batchid:string){
    let query="?batchid="+batchid;
    return this.api.getSimple(APPURLs.batchdetailAttendancePhotos+query);
}




  



  

}