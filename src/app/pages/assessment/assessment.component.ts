import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css']
})
export class AssessmentComponent implements OnInit {
  step = 1;
  loading = false;
  errorMessage = '';

  verifyForm: FormGroup;
  candidateId = 0;
  batchNo = '';
  candidateName = '';

  questions: QuestionItem[] = [];
  photoRefId = '';
  selectedFile: File | null = null;
  photoPreview: string | null = null;

  isMobile = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);

  constructor(private fb: FormBuilder, private assessmentService: AssessmentService) {
    this.verifyForm = this.fb.group({
      emailId: ['', [Validators.required, Validators.email]],
      aadhaarNo: ['', Validators.required],
      batchNo: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

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
        if (candidate) {
          this.candidateId = Number(candidate.CandidateId ?? candidate.Id ?? 0);
          this.candidateName = [candidate.FirstName, candidate.LastName].filter(Boolean).join(' ');
          this.batchNo = this.verifyForm.value.batchNo;
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

  private loadQuestions(): void {
    this.loading = true;
    this.assessmentService.getQuestions('SelfAssessment').subscribe({
      next: (res: AssessmentResponse) => {
        this.loading = false;
        if (res.status === '0') {
          this.errorMessage = res.errorMessage || 'Could not load questions.';
          return;
        }
        const { questions = [], options = [] } = res.data ?? {};
        this.questions = questions.map((q: any) => ({
          sectionCode: q.sectionCode,
          sectionName: q.sectionName,
          questionCode: q.questionCode,
          questionName: q.questionName,
          answerType: q.answerType,
          options: options
            .filter((o: any) => o.sectionCode === q.sectionCode && o.questionCode === q.questionCode)
            .sort((a: any, b: any) => (a.newOrderNo ?? 0) - (b.newOrderNo ?? 0))
            .map((o: any) => ({ optionCode: o.optionCode, optionName: o.optionName }))
        }));
        this.step = 2;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Could not load questions.';
      }
    });
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
    if (!this.allAnswered()) {
      this.errorMessage = 'Please answer all questions before proceeding.';
      return;
    }
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
        this.step = 3;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'An error occurred while saving answers.';
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.selectedFile = input.files[0];
    const reader = new FileReader();
    reader.onload = e => this.photoPreview = e.target?.result as string;
    reader.readAsDataURL(this.selectedFile);
  }

  uploadPhoto(): void {
    if (!this.selectedFile && !this.photoPreview) {
      this.finalSubmit();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    if (this.selectedFile) {
      this.assessmentService.uploadImage(this.selectedFile, this.candidateId, this.batchNo, 'SelfiePhoto').subscribe({
        next: (res: AssessmentResponse) => {
          this.loading = false;
          if (res.status === '0') {
            this.errorMessage = res.errorMessage || 'Photo upload failed.';
            return;
          }
          this.photoRefId = res.refId ?? '';
          this.finalSubmit();
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Photo upload failed.';
        }
      });
    } else if (this.photoPreview) {
      this.assessmentService.uploadBase64Image({
        base64Data: this.photoPreview,
        fileName: 'selfie.jpg',
        candidateId: this.candidateId,
        batchNo: this.batchNo,
        name: 'SelfiePhoto'
      }).subscribe({
        next: (res: AssessmentResponse) => {
          this.loading = false;
          if (res.status === '0') {
            this.errorMessage = res.errorMessage || 'Photo upload failed.';
            return;
          }
          this.photoRefId = res.refId ?? '';
          this.finalSubmit();
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Photo upload failed.';
        }
      });
    }
  }

  skipPhoto(): void {
    this.finalSubmit();
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
        this.step = 4;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Final submission failed.';
      }
    });
  }
}
