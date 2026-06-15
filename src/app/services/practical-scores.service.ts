import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
import { APPURLs } from '../shared/constants/url.constants';

export interface PracticalScoresBatch {
  batchNo: string;
  qpName: string;
  venueName: string;
  strStartDate: string;
  strEndDate: string;
}

export interface CandidatePracticalScore {
  candidateId: string;
  firstName: string;
  lastName?: string;
  attendance?: string;
  classParticipation?: string;
  communicationSkills?: string;
  assessmentSkills?: string;
}

export interface PracticalScoresResponse {
  participants: CandidatePracticalScore[];
  alreadySubmitted: boolean;
}

export interface SubmitPracticalScoresRequest {
  batchNo: string;
  scores: CandidatePracticalScore[];
}

@Injectable({ providedIn: 'root' })
export class PracticalScoresService {
  constructor(private api: ApiService) {}

  getBatches(): Observable<PracticalScoresBatch[]> {
    return this.api.getSimple(APPURLs.practicalScoresBatches);
  }

  getScores(batchNo: string): Observable<PracticalScoresResponse> {
    return this.api.getSimple(`${APPURLs.practicalScoresGet}?batchNo=${batchNo}`);
  }

  submitScores(payload: SubmitPracticalScoresRequest): Observable<{ status: string }> {
    return this.api.postSimpleWithHeader(APPURLs.practicalScoresSubmit, payload);
  }
}
