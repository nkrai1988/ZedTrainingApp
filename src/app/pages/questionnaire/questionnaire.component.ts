import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  QuestionnaireService,
  QuestionnaireQuestion,
  QuestionnaireOption,
  QuestionnaireResponse
} from '../../services/questionnaire.service';

type ViewMode = 'list' | 'addQuestion';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit {

  // ── Category selection ──────────────────────────────────────────────────
  categories = ['SelfAssessment', 'ZED', 'LEAN', 'SAMAR'];
  selectedCategory = '';

  // ── Question list ───────────────────────────────────────────────────────
  questions: QuestionnaireQuestion[] = [];
  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  // ── Add question form ───────────────────────────────────────────────────
  viewMode: ViewMode = 'list';
  newQuestion = { questionText: '', correctAnswer: '' };
  newOptions: QuestionnaireOption[] = [
    { optionCode: 'A', optionText: '', selected: false },
    { optionCode: 'B', optionText: '', selected: false }
  ];
  addError = '';
  addSuccess = '';
  addSaving = false;

  constructor(private questionnaireService: QuestionnaireService) {}

  ngOnInit(): void {}

  // ── Load ────────────────────────────────────────────────────────────────

  loadQuestionnaire(): void {
    if (!this.selectedCategory) return;
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.questions = [];

    this.questionnaireService.getQuestionnaire(this.selectedCategory).subscribe({
      next: (res: QuestionnaireResponse) => {
        this.loading = false;
        if (res.status === '0') {
          this.errorMessage = res.errorMessage ?? 'Failed to load questionnaire.';
          return;
        }
        const raw = Array.isArray(res.data) ? res.data : [];
        this.questions = raw.map((r: Record<string, any>) => ({
          questionCode: r['QuestionCode'] ?? r['questionCode'] ?? '',
          questionText: r['QuestionText'] ?? r['questionName'] ?? r['QuestionName'] ?? '',
          answerType:   r['AnswerType']   ?? r['answerType'],
          answerCode:   r['AnswerCode']   ?? r['answerCode'],
          answerText:   r['AnswerText']   ?? r['answerText'],
          answerOther:  r['AnswerOther']  ?? r['answerOther']
        }));
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Failed to load questionnaire.';
      }
    });
  }

  // ── Save answers ────────────────────────────────────────────────────────

  saveAnswers(): void {
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.questionnaireService.updateQuestionnaire({
      category: this.selectedCategory,
      questions: this.questions
    }).subscribe({
      next: (res: QuestionnaireResponse) => {
        this.saving = false;
        if (res.status === '0') {
          this.errorMessage = res.errorMessage ?? 'Save failed.';
          return;
        }
        this.successMessage = 'Questionnaire saved successfully.';
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'An error occurred while saving.';
      }
    });
  }

  // ── Add question ────────────────────────────────────────────────────────

  showAddQuestion(): void {
    this.viewMode = 'addQuestion';
    this.newQuestion = { questionText: '', correctAnswer: '' };
    this.newOptions = [
      { optionCode: 'A', optionText: '', selected: false },
      { optionCode: 'B', optionText: '', selected: false }
    ];
    this.addError = '';
    this.addSuccess = '';
  }

  cancelAddQuestion(): void {
    this.viewMode = 'list';
    this.addError = '';
  }

  addOption(): void {
    if (this.newOptions.length >= 6) return;
    const codes = ['A', 'B', 'C', 'D', 'E', 'F'];
    this.newOptions.push({ optionCode: codes[this.newOptions.length], optionText: '', selected: false });
  }

  removeOption(index: number): void {
    if (this.newOptions.length <= 2) return;
    this.newOptions.splice(index, 1);
  }

  submitAddQuestion(): void {
    this.addError = '';
    this.addSuccess = '';

    if (!this.newQuestion.questionText.trim()) {
      this.addError = 'Question text is required.';
      return;
    }
    if (!this.newQuestion.correctAnswer.trim()) {
      this.addError = 'Correct answer is required.';
      return;
    }
    if (this.newOptions.some(o => !o.optionText.trim())) {
      this.addError = 'All option texts must be filled.';
      return;
    }

    this.addSaving = true;
    this.questionnaireService.addQuestion({
      category: this.selectedCategory,
      questionText: this.newQuestion.questionText,
      correctAnswer: this.newQuestion.correctAnswer,
      options: this.newOptions
    }).subscribe({
      next: (res: QuestionnaireResponse) => {
        this.addSaving = false;
        if (res.status === '0') {
          this.addError = res.errorMessage ?? 'Failed to add question.';
          return;
        }
        this.addSuccess = 'Question added successfully.';
        this.loadQuestionnaire();
        setTimeout(() => { this.viewMode = 'list'; }, 1200);
      },
      error: () => {
        this.addSaving = false;
        this.addError = 'An error occurred while adding the question.';
      }
    });
  }
}
