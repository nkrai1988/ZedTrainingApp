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
  selector: 'app-industry-experience',
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
  templateUrl: './industry-experience.component.html',
  styleUrl: './industry-experience.component.css',
})
export class IndustryExperienceComponent implements OnInit {
  @Input() industryExperienceList: any[] = [];
  @Output() onIndustryExperienceSubmit = new EventEmitter<any>();

  dataRow: any[] = [];
  isOpen = false;
  viewOnly = false;
  industryForm!: FormGroup;

  // ZED Sector inline sub-entries
  zedEntries: any[] = [];
  zedSectorInput = '';
  zedPrimaryInput = false;
  zedDurationYear = '';
  zedDurationMonth = '';
  zedDurationDay = '';
  zedDisciplines = '';
  zedRoles = '';

  constructor(private fb: FormBuilder, public helper: HelperService, private apiService: ApiService) {}

  ngOnInit() {
    this.createForm();
    this.dataRow = [...this.industryExperienceList];
  }

  createForm() {
    this.industryForm = this.fb.group({
      yearFrom:        ['', Validators.required],
      yearTo:          ['', Validators.required],
      organization:    ['', Validators.required],
      department:      [''],
      designation:     [''],
      responsibilities:['', Validators.required],
      proof:           [''],
    });
  }

  openModal() {
    this.industryForm.reset();
    this.zedEntries = [];
    this.clearZedInputs();
    this.isOpen = true;
  }

  closeModal() { this.isOpen = false; }

  handleProofChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (Math.round(file.size / 1024) > 2000) { alert('File size exceeds 2000 KB.'); return; }
    this.apiService.uploadParticipantFile(file, 'proof').subscribe({
      next: (res) => this.industryForm.controls['proof'].setValue(res.path),
      error: () => {
        this.industryForm.controls['proof'].setValue('');
        alert('Failed to upload proof. Please try again.');
      }
    });
  }

  addZedEntry() {
    if (!this.zedSectorInput.trim()) return;
    this.zedEntries.push({
      sector:       this.zedSectorInput,
      isPrimary:    this.zedPrimaryInput,
      durationYear: this.zedDurationYear,
      durationMonth:this.zedDurationMonth,
      durationDay:  this.zedDurationDay,
      disciplines:  this.zedDisciplines,
      roles:        this.zedRoles,
    });
    this.clearZedInputs();
  }

  removeZedEntry(index: number) { this.zedEntries.splice(index, 1); }

  clearZedInputs() {
    this.zedSectorInput = '';
    this.zedPrimaryInput = false;
    this.zedDurationYear = '';
    this.zedDurationMonth = '';
    this.zedDurationDay = '';
    this.zedDisciplines = '';
    this.zedRoles = '';
  }

  handleSave() {
    this.industryForm.markAllAsTouched();
    if (this.industryForm.invalid) return;
    const f = this.industryForm.value;
    this.dataRow.push({
      yearFrom:         f.yearFrom,
      yearTo:           f.yearTo,
      organization:     f.organization,
      department:       f.department,
      designation:      f.designation,
      responsibilities: f.responsibilities,
      proof:            f.proof,
      zedExperiences:   [...this.zedEntries],
    });
    this.onIndustryExperienceSubmit.emit(this.dataRow);
    this.closeModal();
  }

  removeRow(index: number) {
    if (confirm('Remove this experience entry?')) {
      this.dataRow.splice(index, 1);
      this.onIndustryExperienceSubmit.emit(this.dataRow);
    }
  }
}
