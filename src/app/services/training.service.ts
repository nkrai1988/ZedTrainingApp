import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
import { APPURLs } from '../shared/constants/url.constants';

export interface TrainingResponse {
  status: string;
  refId?: string;
  errorMessage?: string;
  isExamEnabled?: boolean;
  attemptCount?: number;
}

// ── Exam ──────────────────────────────────────────────────────────────────────

export interface CheckExamRequest {
  programmeId: string;
  userName: string;
}

export interface SelfiePhoto {
  photo: string;
}

export interface StartExamRequest {
  programmeId: string;
  userName: string;
  selfie?: SelfiePhoto;
}

export interface ExamResult {
  totalMarks: number;
  marksObtained: number;
}

export interface ExamQuestion {
  section: string;
  name: string;
  answer: string;
  selectedAnswer?: string;
  difficulty?: string;
  trainingType?: string;
}

export interface ExamSection {
  sectionName: string;
  questions: ExamQuestion[];
}

export interface SubmitPrecourseExamRequest {
  programmeId: string;
  userName: string;
  startTime: string;
  endTime: string;
  examResult: ExamResult;
}

export interface SubmitFinalExamRequest {
  programmeId: string;
  userName: string;
  startTime: string;
  endTime: string;
  preCourseAttemptsCount: number;
  examResult: ExamResult;
  examPaper: ExamSection[];
  selfieImages?: SelfiePhoto[];
}

export interface SubmitVideoRequest {
  programmeId: string;
  userName: string;
  video1?: SelfiePhoto;
}

// ── Feedback ──────────────────────────────────────────────────────────────────

export interface TrainerFeedback {
  trainerId: string;
  trainerName: string;
  trainersKnowledge: number;
  confidenceLevel: number;
  presentationSkills: number;
  trainersInteration: number;
  ableToResolveQueries: number;
  openToIdeas: number;
  ableToShareExamples: number;
  timeManagement: number;
  timelyArrival: number;
  stressHandling: number;
  engagementLevelAndPositiveRapport: number;
  receivedFeedback: boolean;
  otherSuggestions: string;
}

export interface ObservantFeedback {
  observantId: string;
  observantName: string;
  abilityToExplainZEDConcepts: number;
  presentationSkills: number;
  ableToResolveQueries: number;
  supportingThroughCaseStudies: number;
  recommendAsAFaculty: number;
  receivedFeedback: boolean;
}

export interface FeedbackData {
  overallProgrammeDelivery: number;
  contentAndInformationProvided: number;
  exercisedAndCaseStudiesHelp: number;
  sessionsStructure: number;
  paceOfTheProgram: number;
  timelyConductOfTests: number;
  trainingMaterialUsefulness: number;
  howConfidentToTakeAssignmentsUnderZED: number;
  topThreeImprovementAreas?: string[];
  likeToTakeThisTrainingAgain: string;
  ovelallVenueArrangements: number;
  avAndInternetSupport: number;
  refreshmentsAndFoodQuality: number;
  powerBackup: number;
  eventCoordinationAndTimeManagement: number;
  otherSuggestionsOnVenue: string;
  trainerFeedback: TrainerFeedback[];
  observantFeedback?: ObservantFeedback[];
}

export interface SubmitFeedbackRequest {
  programmeId: string;
  userName: string;
  feedback: FeedbackData;
}

// ── Scores ────────────────────────────────────────────────────────────────────

export interface PScoreObj {
  testMarks: number;
  participationMarks: number;
  attendanceMarks: number;
}

export interface PScoreRequest {
  batchId: string;
  studentId: string;
  pRecommendation: boolean;
  pScoreObj: PScoreObj;
}

export interface MScoreItem {
  subHeading: string;
  questionString: string;
  ratingValue: number;
}

export interface MScoreObject {
  mScoresList: MScoreItem[];
}

export interface MScoreRequest {
  batchId: string;
  studentId: string;
  observantId?: string;
  mRecommendation: boolean;
  mScoreObject?: MScoreObject;
}

// ── Exam time ─────────────────────────────────────────────────────────────────

export interface UpdateExamTimeRequest {
  batchId: string;
  startTime: string;
  endTime?: string;
}

// ── Batch / Forward to ZED ────────────────────────────────────────────────────

export interface Base64File {
  filename: string;
  base64: string;
}

export interface ForwardToZedRequest {
  batchNo: string;
  idParticipants?: string;
  idCoTrainers?: string;
  idSMEs?: string;
  idDeletedParticipants?: string;
  programmeSchedule?: Base64File;
}

// ── Update registration details ───────────────────────────────────────────────

export interface UpdateRegistrationDetailsRequest {
  Id: string;
  City?: string;
  AadhaarNo?: string;
  SpokenLanguagePrimary?: string;
  WrittenLanguagePrimary?: string;
  NominatedThrough?: string;
  AssociatedWith?: string;
  CBIBCRAName?: string;
  CoordinatorName?: string;
  CoordinatorEmail?: string;
  CoordinatorPhone?: string;
  AreaOfKnowledgeOrExpertise?: string;
  ZedDisciplines?: string;
  TotalExperience?: string;
  ZedDisciplinesIndustry?: string;
  SectorsIndustry?: string;
  ExperienceInMasterTraining?: string;
  ZedDisciplinesMT?: string;
  SectorMT?: string;
  ExperienceInAssessment?: string;
  NoOfAssessmentsDone?: string;
  ZedDisciplinesAT?: string;
  SectorAT?: string;
  ExperienceInConsultancy?: string;
  NoOfConsultanciesGiven?: string;
  ZedDisciplinesCT?: string;
  SectorCT?: string;
  SummaryOfSkillSets?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  constructor(private api: ApiService) {}

  checkExamEnabled(request: CheckExamRequest): Observable<TrainingResponse> {
    return this.api.postSimple(APPURLs.trainingCheckExamEnabled, request);
  }

  startExam(request: StartExamRequest): Observable<TrainingResponse> {
    return this.api.postSimple(APPURLs.trainingStartExam, request);
  }

  submitPrecourseExam(request: SubmitPrecourseExamRequest): Observable<TrainingResponse> {
    return this.api.postSimple(APPURLs.trainingSubmitPrecourseExam, request);
  }

  submitFinalExam(request: SubmitFinalExamRequest): Observable<TrainingResponse> {
    return this.api.postSimple(APPURLs.trainingSubmitFinalExam, request);
  }

  submitFeedback(request: SubmitFeedbackRequest): Observable<TrainingResponse> {
    return this.api.postSimple(APPURLs.trainingSubmitFeedback, request);
  }

  submitVideo(request: SubmitVideoRequest): Observable<TrainingResponse> {
    return this.api.postSimple(APPURLs.trainingSubmitVideo, request);
  }

  submitPScore(request: PScoreRequest): Observable<TrainingResponse> {
    return this.api.postSimpleWithHeader(APPURLs.trainingSubmitPScore, request);
  }

  submitMScore(request: MScoreRequest): Observable<TrainingResponse> {
    return this.api.postSimpleWithHeader(APPURLs.trainingSubmitMScore, request);
  }

  updateExamTime(request: UpdateExamTimeRequest): Observable<TrainingResponse> {
    return this.api.postSimpleWithHeader(APPURLs.trainingUpdateExamTime, request);
  }

  updateExamStartEndTime(request: UpdateExamTimeRequest): Observable<TrainingResponse> {
    return this.api.postSimpleWithHeader(APPURLs.trainingUpdateExamStartEndTime, request);
  }

  getBatchRegistrations(batchNo: string): Observable<any> {
    return this.api.getSimple(`${APPURLs.trainingBatchRegistrations}?batchNo=${encodeURIComponent(batchNo)}`);
  }

  forwardToZed(request: ForwardToZedRequest): Observable<TrainingResponse> {
    return this.api.postSimpleWithHeader(APPURLs.trainingForwardToZed, request);
  }

  updateRegistrationDetails(request: UpdateRegistrationDetailsRequest): Observable<TrainingResponse> {
    return this.api.postSimpleWithHeader(APPURLs.trainingUpdateRegistrationDetails, request);
  }
}
