import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
import { APPURLs } from '../shared/constants/url.constants';

export interface QuestionOptionPayload {
  optionCode: string;
  optionText: string;
}

export interface QuestionBankPayload {
  questionText: string;
  correctAnswer: string;
  orgCategoryId: number;
  orgSubCategoryId: number;
  programmeType: string;
  options: QuestionOptionPayload[];
}

@Injectable({ providedIn: 'root' })
export class MasterQuestionnaireService {
  constructor(private api: ApiService) {}

  getSummary(): Observable<any[]> {
    return this.api.getSimple(APPURLs.questionBankSummary);
  }

  getQuestions(categoryId?: number, subCategoryId?: number, programmeType?: string): Observable<any[]> {
    let query = '?';
    if (categoryId) query += `categoryId=${categoryId}&`;
    if (subCategoryId) query += `subCategoryId=${subCategoryId}&`;
    if (programmeType) query += `programmeType=${encodeURIComponent(programmeType)}`;
    return this.api.getSimple(APPURLs.questionBankList + query);
  }

  addQuestion(payload: QuestionBankPayload): Observable<any> {
    return this.api.postSimpleWithHeader(APPURLs.questionBankAdd, payload);
  }

  updateQuestion(id: number, payload: QuestionBankPayload): Observable<any> {
    return this.api.putSimple(`${APPURLs.questionBankUpdate}/${id}`, payload);
  }

  deleteQuestion(id: number): Observable<any> {
    return this.api.delete(`${APPURLs.questionBankDelete}/${id}`);
  }
}
