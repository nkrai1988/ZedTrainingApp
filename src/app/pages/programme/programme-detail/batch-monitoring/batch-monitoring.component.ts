import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchDetailService } from '../../../../services/batchdetail.service';
import { API_STATIC_BASE } from '../../../../shared/constants/url.constants';

@Component({
  selector: 'app-batch-monitoring',
  imports: [CommonModule],
  templateUrl: './batch-monitoring.component.html',
  styleUrl: './batch-monitoring.component.css',
})
export class BatchMonitoringComponent {

  constructor(private batchdetail: BatchDetailService) {}

  @Input() batchId = '';
  dataRow: any[] = [];
  staticBase = API_STATIC_BASE;
  selectedPhoto: string | null = null;

  loading = false;
  showDateModal = false;
  selectedDate = '';
  dateSessions: any[] = [];
  dateAttendance: any[] = [];
  attendanceLoading = false;

  private readonly monthMap: Record<string, number> = {
    Jan:1, Feb:2, Mar:3, Apr:4, May:5, Jun:6,
    Jul:7, Aug:8, Sep:9, Oct:10, Nov:11, Dec:12
  };

  ngOnInit() {
    if (this.batchId) {
      this.getBatchMonitoring();
    }
  }

  getBatchMonitoring() {
    this.loading = true;
    this.batchdetail.getBatchMonitoringList(this.batchId).subscribe({
      next: (res: any) => { this.dataRow = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openDateModal(dateStr: string) {
    if (!dateStr) return;
    this.selectedDate = dateStr;
    this.dateSessions = this.dataRow.filter(r => r.createdDate === dateStr);
    this.dateAttendance = [];
    this.showDateModal = true;

    const parts = dateStr.split(' ');
    const day = parseInt(parts[0], 10);
    const month = this.monthMap[parts[1]] ?? 0;
    const year = parseInt(parts[2], 10);
    if (!day || !month || !year) return;

    this.attendanceLoading = true;
    this.batchdetail.getAttendanceByDate(this.batchId, year, month, day).subscribe({
      next: (res: any) => { this.dateAttendance = res; this.attendanceLoading = false; },
      error: () => { this.attendanceLoading = false; }
    });
  }

  closeDateModal() {
    this.showDateModal = false;
    this.selectedDate = '';
    this.dateSessions = [];
    this.dateAttendance = [];
  }
}
