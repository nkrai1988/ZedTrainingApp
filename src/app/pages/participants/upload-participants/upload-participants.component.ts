import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { ParticipantService } from '../../../services/participant.service';

@Component({
  selector: 'app-upload-participants',
  imports: [
    CommonModule,
    RouterModule,
    ComponentCardComponent,
  ],
  templateUrl: './upload-participants.component.html',
  styleUrl: './upload-participants.component.css',
})
export class UploadParticipantsComponent implements OnInit {
  batchNo = '';
  selectedFile: File | null = null;
  uploading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private participantService: ParticipantService
  ) {}

  ngOnInit(): void {
    this.batchNo = this.route.snapshot.paramMap.get('id') ?? '';
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.errorMessage = '';
    }
  }

  onUpload(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file before uploading.';
      return;
    }

    const ext = this.selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext !== 'csv' && ext !== 'xlsx') {
      this.errorMessage = 'Only .csv and .xlsx files are allowed.';
      return;
    }

    this.uploading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.participantService.uploadParticipants(this.batchNo, this.selectedFile).subscribe({
      next: (res: any) => {
        this.successMessage = res?.message ?? 'Participants uploaded successfully.';
        this.selectedFile = null;
        const fileInput = document.getElementById('participantFile') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        this.uploading = false;
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.message ?? 'Upload failed. Please try again.';
        this.uploading = false;
      },
    });
  }
}
