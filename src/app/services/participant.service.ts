import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
import { APPURLs } from '../shared/constants/url.constants';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  constructor(private api: ApiService) {}

  getUploadBatches(): Observable<any[]> {
    return this.api.getSimple(APPURLs.participantUploadBatches);
  }

  uploadParticipants(batchNo: string, file: File): Observable<any> {
    return this.api.postWithFile(`${APPURLs.participantUpload}/${batchNo}`, {}, file, 'file');
  }
}
