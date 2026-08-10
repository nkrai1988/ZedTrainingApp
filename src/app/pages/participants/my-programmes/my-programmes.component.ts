import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MyProgramme, ParticipantService } from '../../../services/participant.service';

@Component({
  selector: 'app-my-programmes',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './my-programmes.component.html',
})
export class MyProgrammesComponent implements OnInit, OnDestroy {

  searchText = '';
  statusFilter = 'all';

  programmes: MyProgramme[] = [];
  isLoading = true;
  errorMessage = '';

  // per-batchNo assessment window visibility
  private assessmentVisible: { [batchNo: string]: boolean } = {};
  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor(private participantService: ParticipantService) {}

  ngOnInit(): void {
    this.participantService.getMyEnrolledProgrammes().subscribe({
      next: (data) => {
        this.programmes = data;
        this.isLoading = false;
        this.scheduleAssessmentTimers(data);
      },
      error: () => {
        this.errorMessage = 'Failed to load programmes. Please try again.';
        this.isLoading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.timers.forEach(t => clearTimeout(t));
  }

  // Returns true if the Take Assessment button should be shown for this programme
  canTakeAssessment(p: MyProgramme): boolean {
    if (!p.isLastDay) return false;
    // No exam time set by admin → show all day (original behaviour)
    if (!p.examStartTime) return true;
    return this.assessmentVisible[p.batchNo] ?? false;
  }

  private scheduleAssessmentTimers(programmes: MyProgramme[]): void {
    const now = new Date();

    programmes.filter(p => p.isLastDay && p.examStartTime).forEach(p => {
      const start = this.parseExamTime(p.examStartTime);
      const end = p.examEndTime ? this.parseExamTime(p.examEndTime) : null;
      if (!start) return;

      const msToStart = start.getTime() - now.getTime();
      const msToEnd = end ? end.getTime() - now.getTime() : null;

      if (msToEnd !== null && msToEnd <= 0) {
        // Past end time — keep hidden
        this.assessmentVisible = { ...this.assessmentVisible, [p.batchNo]: false };
      } else if (msToStart <= 0) {
        // Already inside window — show immediately
        this.assessmentVisible = { ...this.assessmentVisible, [p.batchNo]: true };
        if (msToEnd !== null && msToEnd > 0) {
          this.timers.push(setTimeout(() => {
            this.assessmentVisible = { ...this.assessmentVisible, [p.batchNo]: false };
          }, msToEnd));
        }
      } else {
        // Not yet started — schedule show
        this.timers.push(setTimeout(() => {
          this.assessmentVisible = { ...this.assessmentVisible, [p.batchNo]: true };
          if (msToEnd !== null && msToEnd > 0) {
            this.timers.push(setTimeout(() => {
              this.assessmentVisible = { ...this.assessmentVisible, [p.batchNo]: false };
            }, msToEnd - msToStart));
          }
        }, msToStart));
      }
    });
  }

  // Parses "10:30 AM" / "2:30 PM" / "10:30" (24-hr) against today's date
  private parseExamTime(timeStr: string): Date | null {
    const trimmed = timeStr.trim();
    // 24-hour HH:mm (from flatpickr time picker)
    const match24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
    if (match24) {
      const d = new Date();
      d.setHours(parseInt(match24[1], 10), parseInt(match24[2], 10), 0, 0);
      return d;
    }
    // 12-hour h:mm AM/PM (legacy)
    const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match12) return null;
    let hours = parseInt(match12[1], 10);
    const minutes = parseInt(match12[2], 10);
    const period = match12[3].toUpperCase();
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d;
  }

  progressFor(status: string): number {
    if (status === 'completed') return 100;
    if (status === 'ongoing') return 50;
    return 0;
  }

  locationFor(p: MyProgramme): string {
    return [p.venueName, p.district, p.state].filter(Boolean).join(', ');
  }

  get filteredProgrammes(): MyProgramme[] {
    let result = this.programmes;

    if (this.statusFilter !== 'all') {
      result = result.filter(p => p.status === this.statusFilter);
    }

    const q = this.searchText.trim().toLowerCase();
    if (q) {
      result = result.filter(p =>
        p.programmeName.toLowerCase().includes(q) ||
        p.batchNo.toLowerCase().includes(q) ||
        p.qpCode.toLowerCase().includes(q)
      );
    }

    return result;
  }
}
