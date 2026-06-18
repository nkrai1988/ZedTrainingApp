import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AssessmentService,
  AssessmentQuestion,
  AssessmentResponse
} from '../../services/assessment.service';

interface QuestionItem {
  sectionCode: string;
  sectionName: string;
  questionCode: string;
  questionName: string;
  answerType: string;
  options: OptionItem[];
  answerCode?: string;
  answerText?: string;
  answerOther?: string;
}

interface OptionItem {
  optionCode: string;
  optionName: string;
}

@Component({
  selector: 'app-assessment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css']
})
export class AssessmentComponent implements OnInit, OnDestroy {

  // Steps: 1=Verify, 2=Details, 3=Photo, 4=Questions, 5=Review, 6=Done
  step = 1;
  loading = false;
  errorMessage = '';

  verifyForm: FormGroup;
  candidateId = 0;
  batchNo = '';
  candidateName = '';
  candidateEmail = '';
  candidateMobile = '';
  programmeId = '';
  programmeName = '';
  venue = '';
  programLink = '';

  questions: QuestionItem[] = [];
  currentPage = 1;
  readonly pageSize = 10;
  declared = false;

  // Camera
  @ViewChild('videoElement') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasRef!: ElementRef<HTMLCanvasElement>;
  private cameraStream: MediaStream | null = null;
  cameraError = '';
  photoTaken = false;
  photoPreview: string | null = null;
  photoRefId = '';

  get totalPages(): number {
    return Math.ceil(this.questions.length / this.pageSize);
  }

  get pageStart(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get pagedQuestions(): QuestionItem[] {
    return this.questions.slice(this.pageStart, this.pageStart + this.pageSize);
  }

  get isLastPage(): boolean {
    return this.currentPage === this.totalPages;
  }

  currentPageAnswered(): boolean {
    return this.pagedQuestions.every(q => q.answerCode || q.answerText);
  }

  constructor(private fb: FormBuilder, private assessmentService: AssessmentService) {
    this.verifyForm = this.fb.group({
      emailId: ['', [Validators.required, Validators.email]],
      aadhaarNo: ['', Validators.required],
      batchNo: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.stopCamera();
  }

  // ── Step 1: Verify ─────────────────────────────────────────────────────────

  checkStatus(): void {
    if (this.verifyForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';

    this.assessmentService.checkExamStatus(this.verifyForm.value).subscribe({
      next: (res: any) => {
        this.loading = false;
        const statusRow = res?.Table?.[0];
        if (!statusRow || statusRow.ErrorStatus === 0) {
          this.errorMessage = statusRow?.ErrorMessage || 'Verification failed.';
          return;
        }

        const candidate = res?.Table5?.[0];
        const programme = res?.Table4?.[0];

        if (candidate) {
          this.candidateId = Number(candidate.CandidateId ?? candidate.Id ?? 0);
          this.candidateName = [candidate.FirstName, candidate.LastName].filter(Boolean).join(' ');
          this.candidateEmail = candidate.EmailId ?? candidate.Email ?? '';
          this.candidateMobile = candidate.MobileNo ?? candidate.Mobile ?? candidate.PhoneNo ?? '';
          this.batchNo = this.verifyForm.value.batchNo;
        }

        if (programme) {
          this.programmeId = programme.BatchNo ?? '';
          this.programmeName = programme.QpName ?? '';
          this.venue = programme.VenueName ?? '';
          this.programLink = programme.WebLink ?? '';
        }

        const rawQuestions: any[] = res?.Table2 ?? [];
        const rawOptions: any[] = res?.Table3 ?? [];

        this.questions = rawQuestions.map((q: any) => ({
          sectionCode: q.SectionCode,
          sectionName: q.SectionName,
          questionCode: q.QuestionCode,
          questionName: q.QuestionText,
          answerType: 'radio',
          options: rawOptions
            .filter((o: any) => o.SectionCode === q.SectionCode && o.QuestionCode === q.QuestionCode)
            .map((o: any) => ({ optionCode: o.OptionCode, optionName: o.OptionName }))
        }));

        this.step = 2;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'An error occurred. Please try again.';
      }
    });
  }

  // ── Step 2 → 3: Photo ──────────────────────────────────────────────────────

  goToPhoto(): void {
    this.errorMessage = '';
    this.cameraError = '';
    this.photoTaken = false;
    this.photoPreview = null;
    this.step = 3;
    // Wait for *ngIf to render the video element before starting camera
    setTimeout(() => this.startCamera(), 100);
  }

  // ── Step 3: Camera ─────────────────────────────────────────────────────────

  async startCamera(): Promise<void> {
    this.cameraError = '';
    try {
      this.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } }
      });
      const video = this.videoRef?.nativeElement;
      if (video) {
        video.srcObject = this.cameraStream;
        await video.play();
      }
    } catch {
      this.cameraError = 'Camera access denied. Please allow camera permission or skip to proceed.';
    }
  }

  capturePhoto(): void {
    const video = this.videoRef?.nativeElement;
    const canvas = this.canvasRef?.nativeElement;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;
    canvas.getContext('2d')!.drawImage(video, 0, 0, canvas.width, canvas.height);
    this.photoPreview = canvas.toDataURL('image/jpeg', 0.85);
    this.photoTaken = true;
    this.stopCamera();
  }

  retakePhoto(): void {
    this.photoPreview = null;
    this.photoTaken = false;
    setTimeout(() => this.startCamera(), 100);
  }

  stopCamera(): void {
    this.cameraStream?.getTracks().forEach(t => t.stop());
    this.cameraStream = null;
  }

  proceedToQuestions(): void {
    this.stopCamera();
    this.errorMessage = '';
    this.currentPage = 1;
    this.step = 4;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  backToDetails(): void {
    this.stopCamera();
    this.errorMessage = '';
    this.step = 2;
  }

  // ── Step 4: Questions ──────────────────────────────────────────────────────

  nextPage(): void {
    if (!this.currentPageAnswered()) {
      this.errorMessage = 'Please answer all questions on this page before continuing.';
      return;
    }
    this.errorMessage = '';
    this.currentPage++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prevPage(): void {
    this.errorMessage = '';
    this.currentPage--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToReview(): void {
    if (!this.allAnswered()) {
      this.errorMessage = 'Please answer all questions before proceeding.';
      return;
    }
    this.errorMessage = '';
    this.step = 5;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Step 5: Review ─────────────────────────────────────────────────────────

  backToQuestions(): void {
    this.errorMessage = '';
    this.declared = false;
    this.currentPage = this.totalPages;
    this.step = 4;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selectAnswer(question: QuestionItem, optionCode: string, optionName: string): void {
    question.answerCode = optionCode;
    question.answerText = optionName;
  }

  setOtherAnswer(question: QuestionItem, value: string): void {
    question.answerOther = value;
  }

  setTextAnswer(question: QuestionItem, value: string): void {
    question.answerText = value;
  }

  allAnswered(): boolean {
    return this.questions.every(q => q.answerCode || q.answerText);
  }

  submitQuestions(): void {
    if (!this.allAnswered() || !this.declared) return;
    this.loading = true;
    this.errorMessage = '';

    const payload = {
      candidateId: this.candidateId,
      batchNo: this.batchNo,
      questions: this.questions.map(q => ({
        sectionCode: q.sectionCode,
        sectionText: q.sectionName,
        questionCode: q.questionCode,
        questionText: q.questionName,
        answerType: q.answerType,
        answerCode: q.answerCode,
        answerText: q.answerText,
        answerOther: q.answerOther
      } as AssessmentQuestion))
    };

    this.assessmentService.submitQuestions(payload).subscribe({
      next: (res: AssessmentResponse) => {
        this.loading = false;
        if (res.status === '0') {
          this.errorMessage = res.errorMessage || 'Failed to save answers.';
          return;
        }
        this.uploadPhotoThenFinish();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'An error occurred while saving answers.';
      }
    });
  }

  // ── Photo upload + final submit ─────────────────────────────────────────────

  private uploadPhotoThenFinish(): void {
    if (!this.photoPreview) {
      this.finalSubmit();
      return;
    }

    this.loading = true;
    this.assessmentService.uploadBase64Image({
      base64Data: this.photoPreview,
      fileName: 'selfie.jpg',
      candidateId: this.candidateId,
      batchNo: this.batchNo,
      name: 'SelfiePhoto'
    }).subscribe({
      next: (res: AssessmentResponse) => {
        this.loading = false;
        this.photoRefId = res.refId ?? '';
        this.finalSubmit();
      },
      error: () => {
        this.loading = false;
        this.finalSubmit();
      }
    });
  }

  private finalSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    this.assessmentService.finalSubmit({ candidateId: this.candidateId, batchNo: this.batchNo }).subscribe({
      next: (res: AssessmentResponse) => {
        this.loading = false;
        if (res.status === '0') {
          this.errorMessage = res.errorMessage || 'Final submission failed.';
          return;
        }
        this.step = 6;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Final submission failed.';
      }
    });
  }
}
