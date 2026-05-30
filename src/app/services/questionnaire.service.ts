import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
import { APPURLs } from '../shared/constants/url.constants';

// ── Models ───────────────────────────────────────────────────────────────────

export interface QuestionnaireQuestion {
  questionCode: string;
  questionText: string;
  answerType?: string;
  answerCode?: string;
  answerText?: string;
  answerOther?: string;
}

export interface UpdateQuestionnaireRequest {
  category: string;
  questions: QuestionnaireQuestion[];
}

export interface QuestionnaireOption {
  optionCode: string;
  optionText: string;
  answerCode?: string;
  selected: boolean;
}

export interface AddQuestionRequest {
  category: string;
  questionText: string;
  correctAnswer: string;
  options: QuestionnaireOption[];
}

export interface QuestionnaireResponse {
  status: string;
  errorMessage?: string;
  data?: any;
}

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {

  constructor(private api: ApiService) {}

  getQuestionnaire(category: string): Observable<QuestionnaireResponse> {
    return this.api.getSimple(`${APPURLs.questionnaireGet}?category=${encodeURIComponent(category)}`);
  }

  updateQuestionnaire(payload: UpdateQuestionnaireRequest): Observable<QuestionnaireResponse> {
    return this.api.postSimpleWithHeader(APPURLs.questionnaireUpdate, payload);
  }

  addQuestion(payload: AddQuestionRequest): Observable<QuestionnaireResponse> {
    return this.api.postSimpleWithHeader(APPURLs.questionnaireAddQuestion, payload);
  }
}
