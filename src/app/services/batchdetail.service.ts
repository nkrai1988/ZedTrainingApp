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

getBatchFeedbackPhotoList(batchid:string){
    let query="?batchid="+batchid;
    return this.api.getSimple(APPURLs.batchdetailFeedbackPhotos+query);
}

updateVenue(batchNo: string, venueName: string, zip: string) {
    const query = `?batchNo=${encodeURIComponent(batchNo)}&venueName=${encodeURIComponent(venueName)}&zip=${encodeURIComponent(zip)}`;
    return this.api.patchSimple(APPURLs.batchdetailUpdateVenue + query, {});
}

updateParticipant(id: number, body: { firstName: string, lastName: string }) {
    return this.api.patchSimple(`${APPURLs.batchdetailUpdateParticipant}?id=${id}`, body);
}

getExamAnswers(candidateId: number, batchNo: string) {
    return this.api.getSimple(`${APPURLs.batchdetailExamAnswers}?candidateId=${candidateId}&batchNo=${encodeURIComponent(batchNo)}`);
}

getAttendanceByDate(batchNo: string, year: number, month: number, day: number) {
    return this.api.getSimple(`${APPURLs.batchdetailAttendanceByDate}?batchNo=${encodeURIComponent(batchNo)}&year=${year}&month=${month}&day=${day}`);
}

exportExcel(batchid: string) {
    return this.api.getTestFile(`${APPURLs.batchdetailExportExcel}?batchid=${encodeURIComponent(batchid)}`);
}




  



  

}