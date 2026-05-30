import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
import { APPURLs } from '../shared/constants/url.constants';

export interface CheckExamStatusRequest {
  emailId: string;
  aadhaarNo: string;
  batchNo: string;
}

export interface AssessmentQuestion {
  sectionCode?: string;
  sectionText?: string;
  questionCode?: string;
  questionText?: string;
  answerType?: string;
  answerCode?: string;
  answerText?: string;
  answerOther?: string;
}

export interface SelfAssessmentSubmit {
  candidateId: number;
  batchNo: string;
  questions: AssessmentQuestion[];
}

export interface FinalSubmitRequest {
  candidateId: number;
  batchNo: string;
}

export interface UploadBase64ImageRequest {
  base64Data: string;
  fileName: string;
  candidateId: number;
  batchNo: string;
  name: string;
}

export interface AssessmentResponse {
  status: string;
  errorMessage?: string;
  refId?: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  constructor(private api: ApiService) {}

  checkExamStatus(request: CheckExamStatusRequest): Observable<AssessmentResponse> {
    return this.api.postSimple(APPURLs.assessmentCheckStatus, request);
  }

  getQuestions(category?: string): Observable<AssessmentResponse> {
    const url = category
      ? `${APPURLs.assessmentQuestions}?category=${encodeURIComponent(category)}`
      : APPURLs.assessmentQuestions;
    return this.api.postSimple(url, {});
  }

  submitQuestions(model: SelfAssessmentSubmit): Observable<AssessmentResponse> {
    return this.api.postSimple(APPURLs.assessmentSubmitQuestions, model);
  }

  finalSubmit(request: FinalSubmitRequest): Observable<AssessmentResponse> {
    return this.api.postSimple(APPURLs.assessmentFinalSubmit, request);
  }

  uploadImage(file: File, candidateId: number, batchNo: string, name: string): Observable<AssessmentResponse> {
    return this.api.postWithFile(APPURLs.assessmentUploadImage, { candidateId, batchNo, name }, file, 'imageFile');
  }

  uploadBase64Image(request: UploadBase64ImageRequest): Observable<AssessmentResponse> {
    return this.api.postSimple(APPURLs.assessmentUploadBase64Image, request);
  }
}
