import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrgCategoryService } from '../../services/org-category.service';
import { UploadDocumentsService } from '../../services/upload-documents.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-upload-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-documents.component.html',
})
export class UploadDocumentsComponent implements OnInit {
  constructor(
    private orgCategoryService: OrgCategoryService,
    private uploadService: UploadDocumentsService
  ) {}

  // ── filter / upload form state ─────────────────────────────────
  allCategories: any[] = [];
  subCategories: any[] = [];
  programmeTypes = ['Training Programme', 'Awareness Programme'];

  selectedCategoryId: number | null = null;
  selectedSubCategoryId: number | null = null;
  selectedProgrammeType = '';

  documentTitle = '';
  documentType = '';

  pdfFile: File | null = null;
  videoFile: File | null = null;
  pdfDragOver = false;
  videoDragOver = false;

  uploadError = '';
  uploadSuccess = '';
  uploading = false;

  // ── history table state ────────────────────────────────────────
  historyRows: any[] = [];
  historyLoading = false;
  historyCategoryId: number | null = null;
  historySubCategoryId: number | null = null;
  historySubCategories: any[] = [];
  historyProgrammeType = '';

  // ── edit modal state ───────────────────────────────────────────
  showEditModal = false;
  editDoc: any = null;
  editTitle = '';
  editDocumentType = '';
  editCategoryId: number | null = null;
  editSubCategoryId: number | null = null;
  editProgrammeType = '';
  editSubCategories: any[] = [];
  editSaving = false;
  editError = '';

  ngOnInit() {
    this.loadCategories();
    this.loadHistory();
  }

  loadCategories() {
    this.orgCategoryService.getCategories().subscribe({
      next: (res: any[]) => {
        this.allCategories = res;
      }
    });
  }

  onCategoryChange(categoryId: number) {
    this.selectedCategoryId = categoryId;
    this.selectedSubCategoryId = null;
    const cat = this.allCategories.find(c => c.id === +categoryId);
    this.subCategories = cat ? cat.subCategories : [];
  }

  onHistoryCategoryChange(categoryId: number) {
    this.historyCategoryId = categoryId;
    this.historySubCategoryId = null;
    const cat = this.allCategories.find(c => c.id === +categoryId);
    this.historySubCategories = cat ? cat.subCategories : [];
  }

  // ── PDF drag & drop ───────────────────────────────────────────
  onPdfDragOver(event: DragEvent) {
    event.preventDefault();
    this.pdfDragOver = true;
  }
  onPdfDragLeave() { this.pdfDragOver = false; }
  onPdfDrop(event: DragEvent) {
    event.preventDefault();
    this.pdfDragOver = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.setPdfFile(file);
  }
  onPdfBrowse(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.setPdfFile(file);
  }
  setPdfFile(file: File) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf') { this.uploadError = 'Only PDF files are allowed in this zone.'; return; }
    if (file.size > 5 * 1024 * 1024) { this.uploadError = 'PDF file must be under 5 MB.'; return; }
    this.pdfFile = file;
    this.videoFile = null;
    this.uploadError = '';
  }

  // ── Video drag & drop ─────────────────────────────────────────
  onVideoDragOver(event: DragEvent) {
    event.preventDefault();
    this.videoDragOver = true;
  }
  onVideoDragLeave() { this.videoDragOver = false; }
  onVideoDrop(event: DragEvent) {
    event.preventDefault();
    this.videoDragOver = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.setVideoFile(file);
  }
  onVideoBrowse(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.setVideoFile(file);
  }
  setVideoFile(file: File) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['mp4', 'avi', 'mov'].includes(ext ?? '')) { this.uploadError = 'Only MP4, AVI, MOV files are allowed in this zone.'; return; }
    if (file.size > 25 * 1024 * 1024) { this.uploadError = 'Video file must be under 25 MB.'; return; }
    this.videoFile = file;
    this.pdfFile = null;
    this.uploadError = '';
  }

  get activeFile(): File | null { return this.pdfFile ?? this.videoFile; }

  // ── Upload ────────────────────────────────────────────────────
  upload() {
    this.uploadError = '';
    this.uploadSuccess = '';

    if (!this.activeFile) { this.uploadError = 'Please select a PDF or video file.'; return; }
    if (!this.documentTitle.trim()) { this.uploadError = 'Document title is required.'; return; }
    if (!this.selectedCategoryId) { this.uploadError = 'Please select a category.'; return; }
    if (!this.selectedSubCategoryId) { this.uploadError = 'Please select a sub-category.'; return; }

    this.uploading = true;
    this.uploadService.uploadDocument(this.activeFile, {
      documentTitle: this.documentTitle.trim(),
      documentType: this.documentType.trim(),
      orgCategoryId: this.selectedCategoryId,
      orgSubCategoryId: this.selectedSubCategoryId,
      programmeType: this.selectedProgrammeType,
    }).subscribe({
      next: () => {
        this.uploadSuccess = 'Document uploaded successfully.';
        this.uploading = false;
        this.resetForm();
        this.loadHistory();
        setTimeout(() => this.uploadSuccess = '', 5000);
      },
      error: (err: any) => {
        this.uploadError = err?.error ?? 'Upload failed. Please try again.';
        this.uploading = false;
      }
    });
  }

  resetForm() {
    this.pdfFile = null;
    this.videoFile = null;
    this.documentTitle = '';
    this.documentType = '';
  }

  // ── History ───────────────────────────────────────────────────
  loadHistory() {
    this.historyLoading = true;
    this.uploadService.getDocuments(
      this.historyCategoryId ?? undefined,
      this.historySubCategoryId ?? undefined,
      this.historyProgrammeType
    ).subscribe({
      next: (res: any) => {
        this.historyRows = res;
        this.historyLoading = false;
      },
      error: () => { this.historyLoading = false; }
    });
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${date} • ${time}`;
  }

  private readonly BADGE_PALETTE = [
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
    'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  ];

  private labelHash(label: string): number {
    let h = 0;
    for (let i = 0; i < label.length; i++) {
      h = (label.charCodeAt(i) + ((h << 5) - h)) & 0x7fffffff;
    }
    return h;
  }

  categoryBadge(label: string): string {
    return this.BADGE_PALETTE[this.labelHash(label) % this.BADGE_PALETTE.length];
  }

  subCategoryBadge(label: string): string {
    return this.BADGE_PALETTE[(this.labelHash(label) + 3) % this.BADGE_PALETTE.length];
  }

  getFileUrl(filePath: string): string {
    return environment.apiurl.replace(/\/api$/, '') + '/' + filePath;
  }

  // ── Edit ──────────────────────────────────────────────────────
  openEdit(row: any) {
    this.editDoc = row;
    this.editTitle = row.documentTitle;
    this.editDocumentType = row.documentType ?? '';
    this.editProgrammeType = row.programmeType ?? '';
    this.editCategoryId = row.orgCategoryId;
    this.editSubCategoryId = row.orgSubCategoryId;
    const cat = this.allCategories.find((c: any) => c.id === row.orgCategoryId);
    this.editSubCategories = cat ? cat.subCategories : [];
    this.editError = '';
    this.showEditModal = true;
  }

  onEditCategoryChange(categoryId: number) {
    this.editCategoryId = +categoryId;
    this.editSubCategoryId = null;
    const cat = this.allCategories.find((c: any) => c.id === +categoryId);
    this.editSubCategories = cat ? cat.subCategories : [];
  }

  saveEdit() {
    if (!this.editTitle.trim()) { this.editError = 'Document title is required.'; return; }
    if (!this.editCategoryId) { this.editError = 'Please select a category.'; return; }
    if (!this.editSubCategoryId) { this.editError = 'Please select a sub-category.'; return; }

    this.editSaving = true;
    this.editError = '';

    this.uploadService.updateDocument(this.editDoc.id, {
      documentTitle: this.editTitle.trim(),
      documentType: this.editDocumentType.trim(),
      orgCategoryId: this.editCategoryId,
      orgSubCategoryId: this.editSubCategoryId,
      programmeType: this.editProgrammeType,
    }).subscribe({
      next: () => {
        this.editSaving = false;
        this.showEditModal = false;
        this.loadHistory();
      },
      error: (err: any) => {
        this.editError = err?.error ?? 'Failed to save changes.';
        this.editSaving = false;
      }
    });
  }

  closeEdit() {
    this.showEditModal = false;
    this.editDoc = null;
    this.editError = '';
  }

  deleteDocument(id: number) {
    if (!confirm('Remove this document?')) return;
    this.uploadService.deleteDocument(id).subscribe({
      next: () => this.loadHistory()
    });
  }
}
