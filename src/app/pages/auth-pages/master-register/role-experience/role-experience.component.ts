import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../../shared/components/form/select/select.component';
import { FileInputComponent } from '../../../../shared/components/form/input/file-input.component';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { HelperService } from '../../../../services/helper.service';
import { ApiService } from '../../../../shared/services/api.service';

@Component({
  selector: 'app-role-experience',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    LabelComponent,
    SelectComponent,
    FileInputComponent,
    ModalComponent,
  ],
  templateUrl: './role-experience.component.html',
  styleUrl: './role-experience.component.css',
})
export class RoleExperienceComponent implements OnInit {
  @Input() roleExperienceData: any = {};
  @Output() onRoleExperienceSubmit = new EventEmitter<any>();

  yearOptions: any[] = [];
  monthOptions: any[] = [];
  dayOptions: any[] = [];

  // §9A — Training as Faculty (Master Trainer)
  trainingRows: any[] = [];
  isTrainingOpen = false;
  trainingForm!: FormGroup;
  trainingYearSelect = '';
  trainingMonthSelect = '';
  trainingDaySelect = '';

  // §9B — Assessment Experience (Assessor)
  assessmentRows: any[] = [];
  isAssessmentOpen = false;
  assessmentForm!: FormGroup;
  assessmentYearSelect = '';
  assessmentMonthSelect = '';
  assessmentDaySelect = '';
  noOfAssessmentsDone = '';

  // §9C — Consultancy Experience (ZED Consultant)
  consultancyRows: any[] = [];
  isConsultancyOpen = false;
  consultancyForm!: FormGroup;
  consultancyYearSelect = '';
  consultancyMonthSelect = '';
  consultancyDaySelect = '';
  noOfConsultanciesGiven = '';

  constructor(private fb: FormBuilder, public helper: HelperService, private apiService: ApiService) {}

  ngOnInit() {
    this.createForms();
    const range = this.helper.getDayMonthYearRange();
    this.yearOptions  = this.helper.createOptions(range.Years);
    this.monthOptions = this.helper.createOptions(range.Months);
    this.dayOptions   = this.helper.createOptions(range.Days);

    if (this.roleExperienceData) {
      this.trainingRows         = this.roleExperienceData.trainingRows        ?? [];
      this.assessmentRows       = this.roleExperienceData.assessmentRows      ?? [];
      this.consultancyRows      = this.roleExperienceData.consultancyRows     ?? [];
      this.noOfAssessmentsDone  = this.roleExperienceData.noOfAssessmentsDone ?? '';
      this.noOfConsultanciesGiven = this.roleExperienceData.noOfConsultanciesGiven ?? '';
    }
  }

  createForms() {
    this.trainingForm = this.fb.group({
      trainingname:    ['', Validators.required],
      organization:    ['', Validators.required],
      responsibilities:['', Validators.required],
      zeddisciplines:  [''],
      sector:          [''],
      durationyear:    ['', Validators.required],
      durationmonth:   [''],
      durationday:     [''],
    });

    this.assessmentForm = this.fb.group({
      projectname:     ['', Validators.required],
      organization:    ['', Validators.required],
      area:            [''],
      sector:          [''],
      responsibilities:[''],
      durationyear:    ['', Validators.required],
      durationmonth:   [''],
      durationday:     [''],
      proof:           [''],
    });

    this.consultancyForm = this.fb.group({
      projectname:     ['', Validators.required],
      organization:    ['', Validators.required],
      area:            [''],
      sector:          [''],
      responsibilities:[''],
      durationyear:    ['', Validators.required],
      durationmonth:   [''],
      durationday:     [''],
      proof:           [''],
    });
  }

  // ── §9A Training as Faculty ─────────────────────────────────────────────────

  openTrainingModal() {
    this.trainingForm.reset();
    this.trainingYearSelect = '';
    this.trainingMonthSelect = '';
    this.trainingDaySelect = '';
    this.isTrainingOpen = true;
  }

  closeTrainingModal() { this.isTrainingOpen = false; }

  setTrainingYear(v: any)  { this.trainingYearSelect  = v; this.trainingForm.controls['durationyear'].setValue(v); }
  setTrainingMonth(v: any) { this.trainingMonthSelect = v; this.trainingForm.controls['durationmonth'].setValue(v); }
  setTrainingDay(v: any)   { this.trainingDaySelect   = v; this.trainingForm.controls['durationday'].setValue(v); }

  saveTraining() {
    this.trainingForm.markAllAsTouched();
    if (this.trainingForm.invalid) return;
    this.trainingRows.push({ ...this.trainingForm.value });
    this.emitData();
    this.closeTrainingModal();
  }

  removeTrainingRow(i: number) {
    if (confirm('Remove this entry?')) { this.trainingRows.splice(i, 1); this.emitData(); }
  }

  // ── §9B Assessment Experience ───────────────────────────────────────────────

  openAssessmentModal() {
    this.assessmentForm.reset();
    this.assessmentYearSelect = '';
    this.assessmentMonthSelect = '';
    this.assessmentDaySelect = '';
    this.isAssessmentOpen = true;
  }

  closeAssessmentModal() { this.isAssessmentOpen = false; }

  setAssessmentYear(v: any)  { this.assessmentYearSelect  = v; this.assessmentForm.controls['durationyear'].setValue(v); }
  setAssessmentMonth(v: any) { this.assessmentMonthSelect = v; this.assessmentForm.controls['durationmonth'].setValue(v); }
  setAssessmentDay(v: any)   { this.assessmentDaySelect   = v; this.assessmentForm.controls['durationday'].setValue(v); }

  handleAssessmentProof(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (Math.round(file.size / 1024) > 2000) { alert('File size exceeds 2000 KB.'); return; }
    this.apiService.uploadParticipantFile(file, 'proof').subscribe({
      next: (res) => this.assessmentForm.controls['proof'].setValue(res.path),
      error: () => {
        this.assessmentForm.controls['proof'].setValue('');
        alert('Failed to upload proof. Please try again.');
      }
    });
  }

  saveAssessment() {
    this.assessmentForm.markAllAsTouched();
    if (this.assessmentForm.invalid) return;
    this.assessmentRows.push({ ...this.assessmentForm.value });
    this.emitData();
    this.closeAssessmentModal();
  }

  removeAssessmentRow(i: number) {
    if (confirm('Remove this entry?')) { this.assessmentRows.splice(i, 1); this.emitData(); }
  }

  // ── §9C Consultancy Experience ──────────────────────────────────────────────

  openConsultancyModal() {
    this.consultancyForm.reset();
    this.consultancyYearSelect = '';
    this.consultancyMonthSelect = '';
    this.consultancyDaySelect = '';
    this.isConsultancyOpen = true;
  }

  closeConsultancyModal() { this.isConsultancyOpen = false; }

  setConsultancyYear(v: any)  { this.consultancyYearSelect  = v; this.consultancyForm.controls['durationyear'].setValue(v); }
  setConsultancyMonth(v: any) { this.consultancyMonthSelect = v; this.consultancyForm.controls['durationmonth'].setValue(v); }
  setConsultancyDay(v: any)   { this.consultancyDaySelect   = v; this.consultancyForm.controls['durationday'].setValue(v); }

  handleConsultancyProof(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (Math.round(file.size / 1024) > 2000) { alert('File size exceeds 2000 KB.'); return; }
    this.apiService.uploadParticipantFile(file, 'proof').subscribe({
      next: (res) => this.consultancyForm.controls['proof'].setValue(res.path),
      error: () => {
        this.consultancyForm.controls['proof'].setValue('');
        alert('Failed to upload proof. Please try again.');
      }
    });
  }

  saveConsultancy() {
    this.consultancyForm.markAllAsTouched();
    if (this.consultancyForm.invalid) return;
    this.consultancyRows.push({ ...this.consultancyForm.value });
    this.emitData();
    this.closeConsultancyModal();
  }

  removeConsultancyRow(i: number) {
    if (confirm('Remove this entry?')) { this.consultancyRows.splice(i, 1); this.emitData(); }
  }

  // ── Emit ────────────────────────────────────────────────────────────────────

  emitData() {
    this.onRoleExperienceSubmit.emit({
      trainingRows:         this.trainingRows,
      assessmentRows:       this.assessmentRows,
      consultancyRows:      this.consultancyRows,
      noOfAssessmentsDone:  this.noOfAssessmentsDone,
      noOfConsultanciesGiven: this.noOfConsultanciesGiven,
    });
  }
}
