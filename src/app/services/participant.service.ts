import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
import { APPURLs } from '../shared/constants/url.constants';

// ── Models ───────────────────────────────────────────────────────────────────

export interface MyProgramme {
  programmeName: string;
  batchNo: string;
  qpCode: string;
  startDate: string;
  endDate: string;
  venueName: string;
  district: string;
  state: string;
  status: 'completed' | 'ongoing' | 'upcoming';
}

export interface UploadBatch {
  batchNo: string;
  qpName: string;
  venueName: string;
  strStartDate: string;
  strEndDate: string;
  qpCode: string;
  started: number;
}

export interface CandidatesFilter {
  applyingFor: string;
  orgPartnerId: string;
  isBlocked: boolean;
  searchText: string;
  page: number;
  pageSize: number;
}

export interface CandidatesResult {
  data: Record<string, any>[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ParticipantProfile {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  aadhaarNumber: string;
  panNumber: string;
  dateOfBirth: string;
  address: string;
  pinCode: string;
  orgCategory: string;
}

export interface ApplicationStatus {
  hasApplied: boolean;
  status: string | null;
  rejectedComments: string | null;
  participantStatus: string | null;
}

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  constructor(private api: ApiService) {}

  getMyEnrolledProgrammes(): Observable<MyProgramme[]> {
    return this.api.getSimple(APPURLs.participantMyProgrammes);
  }

  getUploadBatches(): Observable<UploadBatch[]> {
    return this.api.getSimple(APPURLs.participantUploadBatches);
  }

  uploadParticipants(batchNo: string, file: File): Observable<{ message: string }> {
    return this.api.postWithFile(`${APPURLs.participantUpload}/${batchNo}`, {}, file, 'file');
  }

  getCandidates(filter: CandidatesFilter): Observable<CandidatesResult> {
    return this.api.postSimpleWithHeader(APPURLs.participantGetCandidates, filter);
  }

  getProfile(): Observable<ParticipantProfile> {
    return this.api.getSimple(APPURLs.participantProfile);
  }

  getApplicationStatus(): Observable<ApplicationStatus> {
    return this.api.getSimple(APPURLs.participantApplicationStatus);
  }

  getOngoingProgrammes(): Observable<any[]> {
    return this.api.getSimple(APPURLs.participantOngoingProgrammes);
  }

  getMyApplication(): Observable<any> {
    return this.api.getSimple(APPURLs.participantMyApplication);
  }

  changePassword(body: { oldPassword: string; newPassword: string; confirmPassword: string }): Observable<{ message: string }> {
    return this.api.postSimpleWithHeader(APPURLs.participantChangePassword, body);
  }
}
