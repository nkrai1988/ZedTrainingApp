import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchDetailService } from '../../../../services/batchdetail.service';
import { API_STATIC_BASE } from '../../../../shared/constants/url.constants';

@Component({
  selector: 'app-batch-attendance',
  imports: [CommonModule],
  templateUrl: './batch-attendance.component.html',
  styleUrl: './batch-attendance.component.css',
})
export class BatchAttendanceComponent {
  constructor(private batchdetail: BatchDetailService) {}

  @Input() batchId = '';
  dataRow: any[] = [];
  photos: any[] = [];
  staticBase = API_STATIC_BASE;
  selectedPhoto: string | null = null;

  ngOnInit() {
    if (this.batchId) {
      this.getAttendance();
      this.getAttendancePhotos();
    }
  }

  getAttendance() {
    this.batchdetail.getBatchAttendanceList(this.batchId).subscribe({
      next: (res: any) => { this.dataRow = res; },
      error: () => {}
    });
  }

  getAttendancePhotos() {
    this.batchdetail.getBatchAttendancePhotoList(this.batchId).subscribe({
      next: (res: any) => { this.photos = res; },
      error: () => {}
    });
  }
}
