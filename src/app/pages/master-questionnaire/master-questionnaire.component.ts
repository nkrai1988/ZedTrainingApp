import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrgCategoryService } from '../../services/org-category.service';
import { MasterQuestionnaireService } from '../../services/master-questionnaire.service';

const OPTION_CODES = ['A', 'B', 'C', 'D', 'E', 'F'];

@Component({
  selector: 'app-master-questionnaire',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './master-questionnaire.component.html',
})
export class MasterQuestionnaireComponent implements OnInit {

  // ── Filter / Add form ──────────────────────────────────────────
  allCategories: any[] = [];
  subCategories: any[] = [];
  programmeTypes = ['Training Programme', 'Awareness Programme'];

  selectedCategoryId: number | null = null;
  selectedSubCategoryId: number | null = null;
  selectedProgrammeType = '';

  questionText = '';
  options: { optionCode: string; optionText: string }[] = [
    { optionCode: 'A', optionText: '' }
  ];
  correctAnswer = '';

  formError = '';
  formSuccess = '';
  formSaving = false;

  // ── Summary table ──────────────────────────────────────────────
  summaryRows: any[] = [];
  summaryLoading = false;

  // ── View questions modal ───────────────────────────────────────
  showViewModal = false;
  viewModalTitle = '';
  viewQuestions: any[] = [];
  viewLoading = false;
  viewGroupParams: { categoryId?: number; subCategoryId?: number; programmeType?: string } = {};

  // ── Edit question modal ────────────────────────────────────────
  showEditModal = false;
  editQuestion: any = null;
  editQuestionText = '';
  editOptions: { optionCode: string; optionText: string }[] = [];
  editCorrectAnswer = '';
  editCategoryId: number | null = null;
  editSubCategoryId: number | null = null;
  editProgrammeType = '';
  editSubCategories: any[] = [];
  editSaving = false;
  editError = '';

  constructor(
    private orgCategoryService: OrgCategoryService,
    private mqService: MasterQuestionnaireService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadSummary();
  }

  loadCategories() {
    this.orgCategoryService.getCategories().subscribe({
      next: (res: any[]) => { this.allCategories = res; }
    });
  }

  onCategoryChange(categoryId: number) {
    this.selectedCategoryId = +categoryId;
    this.selectedSubCategoryId = null;
    const cat = this.allCategories.find((c: any) => c.id === +categoryId);
    this.subCategories = cat ? cat.subCategories : [];
  }

  // ── Add form options ───────────────────────────────────────────
  get validOptionCodes(): string[] {
    return this.options.map(o => o.optionCode);
  }

  addOption() {
    if (this.options.length >= 6) return;
    this.options.push({ optionCode: OPTION_CODES[this.options.length], optionText: '' });
  }

  removeOption(index: number) {
    if (this.options.length <= 1) return;
    this.options.splice(index, 1);
    this.options.forEach((o, i) => o.optionCode = OPTION_CODES[i]);
    if (!this.validOptionCodes.includes(this.correctAnswer)) this.correctAnswer = '';
  }

  // ── Save question ──────────────────────────────────────────────
  saveQuestion() {
    this.formError = '';
    this.formSuccess = '';

    if (!this.selectedCategoryId)     { this.formError = 'Please select a category.'; return; }
    if (!this.selectedSubCategoryId)  { this.formError = 'Please select a sub-category.'; return; }
    if (!this.questionText.trim())    { this.formError = 'Question text is required.'; return; }
    if (this.options.some(o => !o.optionText.trim())) { this.formError = 'All option texts must be filled.'; return; }
    if (!this.correctAnswer)          { this.formError = 'Please select the correct answer.'; return; }

    this.formSaving = true;
    this.mqService.addQuestion({
      questionText:     this.questionText.trim(),
      correctAnswer:    this.correctAnswer,
      orgCategoryId:    this.selectedCategoryId,
      orgSubCategoryId: this.selectedSubCategoryId,
      programmeType:    this.selectedProgrammeType,
      options:          this.options.map(o => ({ optionCode: o.optionCode, optionText: o.optionText.trim() }))
    }).subscribe({
      next: () => {
        this.formSaving = false;
        this.formSuccess = 'Question saved successfully.';
        this.resetForm();
        this.loadSummary();
        setTimeout(() => this.formSuccess = '', 4000);
      },
      error: (err: any) => {
        this.formError = err?.error ?? 'Failed to save question.';
        this.formSaving = false;
      }
    });
  }

  resetForm() {
    this.questionText = '';
    this.options = [{ optionCode: 'A', optionText: '' }];
    this.correctAnswer = '';
    this.formError = '';
  }

  // ── Summary ────────────────────────────────────────────────────
  loadSummary() {
    this.summaryLoading = true;
    this.mqService.getSummary().subscribe({
      next: (res: any[]) => { this.summaryRows = res; this.summaryLoading = false; },
      error: () => { this.summaryLoading = false; }
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // ── View modal ─────────────────────────────────────────────────
  openViewModal(row: any) {
    this.viewModalTitle = `${row.categoryLabel} › ${row.subCategoryLabel}${row.programmeType ? ' — ' + row.programmeType : ''}`;
    this.viewGroupParams = { categoryId: row.orgCategoryId, subCategoryId: row.orgSubCategoryId, programmeType: row.programmeType };
    this.showViewModal = true;
    this.loadViewQuestions();
  }

  loadViewQuestions() {
    this.viewLoading = true;
    this.viewQuestions = [];
    this.mqService.getQuestions(
      this.viewGroupParams.categoryId,
      this.viewGroupParams.subCategoryId,
      this.viewGroupParams.programmeType
    ).subscribe({
      next: (res: any[]) => { this.viewQuestions = res; this.viewLoading = false; },
      error: () => { this.viewLoading = false; }
    });
  }

  closeViewModal() {
    this.showViewModal = false;
    this.viewQuestions = [];
  }

  // ── Edit modal ─────────────────────────────────────────────────
  openEdit(q: any) {
    this.editQuestion    = q;
    this.editQuestionText = q.questionText;
    this.editOptions     = q.options.map((o: any) => ({ optionCode: o.optionCode, optionText: o.optionText }));
    this.editCorrectAnswer = q.correctAnswer;
    this.editCategoryId  = q.orgCategoryId;
    this.editSubCategoryId = q.orgSubCategoryId;
    this.editProgrammeType = q.programmeType ?? '';
    const cat = this.allCategories.find((c: any) => c.id === q.orgCategoryId);
    this.editSubCategories = cat ? cat.subCategories : [];
    this.editError = '';
    this.showEditModal = true;
  }

  get editValidOptionCodes(): string[] {
    return this.editOptions.map(o => o.optionCode);
  }

  addEditOption() {
    if (this.editOptions.length >= 6) return;
    this.editOptions.push({ optionCode: OPTION_CODES[this.editOptions.length], optionText: '' });
  }

  removeEditOption(index: number) {
    if (this.editOptions.length <= 1) return;
    this.editOptions.splice(index, 1);
    this.editOptions.forEach((o, i) => o.optionCode = OPTION_CODES[i]);
    if (!this.editValidOptionCodes.includes(this.editCorrectAnswer)) this.editCorrectAnswer = '';
  }

  onEditCategoryChange(categoryId: number) {
    this.editCategoryId = +categoryId;
    this.editSubCategoryId = null;
    const cat = this.allCategories.find((c: any) => c.id === +categoryId);
    this.editSubCategories = cat ? cat.subCategories : [];
  }

  saveEdit() {
    if (!this.editQuestionText.trim()) { this.editError = 'Question text is required.'; return; }
    if (this.editOptions.some(o => !o.optionText.trim())) { this.editError = 'All option texts must be filled.'; return; }
    if (!this.editCorrectAnswer) { this.editError = 'Please select the correct answer.'; return; }
    if (!this.editCategoryId)    { this.editError = 'Please select a category.'; return; }
    if (!this.editSubCategoryId) { this.editError = 'Please select a sub-category.'; return; }

    this.editSaving = true;
    this.editError = '';

    this.mqService.updateQuestion(this.editQuestion.id, {
      questionText:     this.editQuestionText.trim(),
      correctAnswer:    this.editCorrectAnswer,
      orgCategoryId:    this.editCategoryId,
      orgSubCategoryId: this.editSubCategoryId,
      programmeType:    this.editProgrammeType,
      options:          this.editOptions.map(o => ({ optionCode: o.optionCode, optionText: o.optionText.trim() }))
    }).subscribe({
      next: () => {
        this.editSaving = false;
        this.showEditModal = false;
        this.loadViewQuestions();
        this.loadSummary();
      },
      error: (err: any) => {
        this.editError = err?.error ?? 'Failed to update question.';
        this.editSaving = false;
      }
    });
  }

  closeEdit() {
    this.showEditModal = false;
    this.editQuestion = null;
    this.editError = '';
  }

  // ── Delete ─────────────────────────────────────────────────────
  deleteQuestion(id: number) {
    if (!confirm('Delete this question?')) return;
    this.mqService.deleteQuestion(id).subscribe({
      next: () => { this.loadViewQuestions(); this.loadSummary(); }
    });
  }
}
