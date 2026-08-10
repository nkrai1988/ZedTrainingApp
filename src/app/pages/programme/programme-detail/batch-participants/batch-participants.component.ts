import { Component, HostListener, Input } from '@angular/core';
import { BatchDetailService } from '../../../../services/batchdetail.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { API_STATIC_BASE } from '../../../../shared/constants/url.constants';

@Component({
  selector: 'app-batch-participants',
  imports: [CommonModule, FormsModule],
  templateUrl: './batch-participants.component.html',
  styleUrl: './batch-participants.component.css',
})
export class BatchParticipantsComponent {

  constructor(private batchdetail: BatchDetailService) {}

  @Input() batchId = '';
  dataRow: any[] = [];
  staticBase = API_STATIC_BASE;

  ngOnInit() {
    if (this.batchId) {
      this.getParticipants();
    }
  }

  selectedParticipant: any = null;
  selectedPhoto: string | null = null;
  showEditModal = false;
  showExamModal = false;
  activePPopup: any = null;
  pPopupX = 0;
  pPopupY = 0;
  loading = false;
  examAnswers: any[] = [];
  examLoading = false;
  editForm = { firstName: '', lastName: '', mobileNo: '', uamNo: '', emailId: '' };
  saving = false;

  getParticipants() {
    this.loading = true;
    this.batchdetail.getBatchParticipantList(this.batchId).subscribe({
      next: (res: any) => { this.dataRow = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  togglePPopup(row: any, event: MouseEvent) {
    if (this.activePPopup === row) { this.activePPopup = null; return; }
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.pPopupX = rect.left;
    this.pPopupY = rect.bottom + 4;
    this.activePPopup = row;
    event.stopPropagation();
  }

  @HostListener('document:click')
  onDocumentClick() { this.activePPopup = null; }

  openEditModal(row: any) {
    this.selectedParticipant = row;
    this.editForm = {
      firstName: row.firstName ?? '',
      lastName: row.lastName ?? '',
      mobileNo: row.mobileNo ?? '',
      uamNo: row.uameem2ssino ?? '',
      emailId: row.emailId ?? ''
    };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedParticipant = null;
  }

  saveParticipant() {
    if (!this.selectedParticipant) return;
    this.saving = true;
    this.batchdetail.updateParticipant(this.selectedParticipant.id, { firstName: this.editForm.firstName, lastName: this.editForm.lastName }).subscribe({
      next: () => {
        const idx = this.dataRow.findIndex((r: any) => r.id === this.selectedParticipant.id);
        if (idx !== -1) {
          this.dataRow[idx] = {
            ...this.dataRow[idx],
            firstName: this.editForm.firstName,
            lastName: this.editForm.lastName,
            mobileNo: this.editForm.mobileNo,
            uameem2ssino: this.editForm.uamNo,
            emailId: this.editForm.emailId
          };
        }
        this.saving = false;
        this.showEditModal = false;
        this.selectedParticipant = null;
      },
      error: () => { this.saving = false; }
    });
  }

  openExamView(row: any) {
    this.selectedParticipant = row;
    this.examAnswers = [];
    this.examLoading = true;
    this.showExamModal = true;
    this.batchdetail.getExamAnswers(row.id, this.batchId).subscribe({
      next: (res: any) => { this.examAnswers = res; this.examLoading = false; },
      error: () => { this.examLoading = false; }
    });
  }

  closeExamModal() {
    this.showExamModal = false;
    this.selectedParticipant = null;
    this.examAnswers = [];
  }
}
