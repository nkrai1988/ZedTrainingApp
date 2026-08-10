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
  isLastDay: boolean;
  examStartTime: string;
  examEndTime: string;
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

  enroll(batchNo: string): Observable<{ message: string; batchNo: string }> {
    return this.api.postSimpleWithHeader(APPURLs.participantEnroll, { batchNo });
  }

  getMyApplication(): Observable<any> {
    return this.api.getSimple(APPURLs.participantMyApplication);
  }

  changePassword(body: { oldPassword: string; newPassword: string; confirmPassword: string }): Observable<{ message: string }> {
    return this.api.postSimpleWithHeader(APPURLs.participantChangePassword, body);
  }

  // ── Application step-save methods ─────────────────────────────────────────

  startApplication(): Observable<{ registrationId: number; lastSavedStep: string | null; status: string }> {
    return this.api.postSimpleWithHeader(APPURLs.applicationStart, {});
  }

  getApplicationProgress(): Observable<any> {
    return this.api.getSimple(APPURLs.applicationProgress);
  }

  submitApplication(): Observable<{ message: string }> {
    return this.api.postSimpleWithHeader(APPURLs.applicationSubmit, {});
  }

  saveStepPhoto(body: { profileImagePath: string }): Observable<any> {
    return this.api.patchSimple(APPURLs.applicationStepPhoto, body);
  }

  saveStepIdProof(body: { idProofDocType: string; idProofDocNumber: string; nameOnDocument: string; idProofImagePath: string }): Observable<any> {
    return this.api.patchSimple(APPURLs.applicationStepIdProof, body);
  }

  saveStepNomination(body: { nominatedThrough: string; accessorCbidCra?: string; consultantOrg?: string; coordinatorName?: string; coordinatorEmail?: string; coordinatorPhone?: string }): Observable<any> {
    return this.api.patchSimple(APPURLs.applicationStepNomination, body);
  }

  saveStepPersonal(body: { firstName: string; middleName?: string; lastName: string; mobileNo: string; dOB: string; parentName?: string; aadhaarNo: string }): Observable<any> {
    return this.api.patchSimple(APPURLs.applicationStepPersonal, body);
  }

  saveStepAddress(body: { mailingAddress: string; state: string; district: string; city: string; pincode: string; mDMobile: string; email: string }): Observable<any> {
    return this.api.patchSimple(APPURLs.applicationStepAddress, body);
  }

  saveStepLanguages(body: { primaryLanguage: string; primaryLangOthers?: string; writingLanguage: string; writingLangOthers?: string }): Observable<any> {
    return this.api.patchSimple(APPURLs.applicationStepLanguages, body);
  }

  saveStepQualifications(body: { qualifications: any[] }): Observable<any> {
    return this.api.patchSimple(APPURLs.applicationStepQualifications, body);
  }

  saveStepExperience(body: { experiences: any[] }): Observable<any> {
    return this.api.patchSimple(APPURLs.applicationStepExperience, body);
  }

  saveStepIndustryExperience(body: { industryExperiences: any[] }): Observable<any> {
    return this.api.patchSimple(APPURLs.applicationStepIndustryExperience, body);
  }

  saveStepSkills(body: { skills: any[] }): Observable<any> {
    return this.api.patchSimple(APPURLs.applicationStepSkills, body);
  }

  saveStepRoleExperience(body: any): Observable<any> {
    return this.api.patchSimple(APPURLs.applicationStepRoleExperience, body);
  }

  saveStepDeclaration(body: { summaryOfSkillSets: string; otherInformation?: string }): Observable<any> {
    return this.api.patchSimple(APPURLs.applicationStepDeclaration, body);
  }

  getMyCertificates(): Observable<any[]> {
    return this.api.getSimple(APPURLs.participantMyCertificates);
  }
}
