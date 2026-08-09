import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchDetailService } from '../../../../services/batchdetail.service';
import { API_STATIC_BASE } from '../../../../shared/constants/url.constants';

@Component({
  selector: 'app-batch-feedback',
  imports: [CommonModule],
  templateUrl: './batch-feedback.component.html',
  styleUrl: './batch-feedback.component.css',
})
export class BatchFeedbackComponent {
  constructor(private batchdetail: BatchDetailService) {}

  @Input() batchId = '';
  dataRow: any = [];
  photos: string[] = [];
  staticBase = API_STATIC_BASE;
  selectedPhoto: string | null = null;

  ngOnInit() {
    if (this.batchId) {
      this.getFeedbacks();
      this.getFeedbackPhotos();
    }
  }

  getFeedbacks() {
    this.batchdetail.getBatchFeedbacksList(this.batchId).subscribe({
      next: (res: any) => { this.dataRow = res; },
      error: () => {}
    });
  }

  getFeedbackPhotos() {
    this.batchdetail.getBatchFeedbackPhotoList(this.batchId).subscribe({
      next: (res: any) => { this.photos = res ?? []; },
      error: () => {}
    });
  }
}
