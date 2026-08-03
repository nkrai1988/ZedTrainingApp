import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ParticipantService, ApplicationStatus, MyProgramme } from '../../../services/participant.service';
interface OngoingProgramme {
  programmeId: string;
  programmeName: string;
  venue: string;
  venueName: string;
  webLink: string;
  district: string;
  state: string;
  startDate: string;
  endDate: string;
  isFree: boolean;
  paidOrFree: string;
  actionType: 'register' | 'closed';
}

@Component({
  selector: 'app-participant-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './participant-dashboard.component.html',
})
export class ParticipantDashboardComponent implements OnInit {

  totalEnrolled = 0;
  ongoingCount = 0;
  completedCount = 0;

  applicationStatus: ApplicationStatus | null = null;
  applicationStatusLoading = true;
  programmesLoading = true;

  programmes: OngoingProgramme[] = [];
  enrolledBatchNos = new Set<string>();

  enrollingBatchNo: string | null = null;
  enrollFeedback: { batchNo: string; success: boolean; message: string } | null = null;

  constructor(private participantService: ParticipantService, private router: Router) {}

  ngOnInit(): void {
    this.participantService.getApplicationStatus().subscribe({
      next: (status) => {
        this.applicationStatus = status;
        this.applicationStatusLoading = false;
      },
      error: () => {
        this.applicationStatusLoading = false;
      }
    });

    this.participantService.getOngoingProgrammes().subscribe({
      next: (data) => {
        this.programmes = data;
        this.programmesLoading = false;
      },
      error: () => {
        this.programmesLoading = false;
      }
    });

    this.loadMyProgrammes();
  }

  private loadMyProgrammes(): void {
    this.participantService.getMyEnrolledProgrammes().subscribe({
      next: (data: MyProgramme[]) => {
        this.enrolledBatchNos = new Set(data.map(p => p.batchNo));
        this.totalEnrolled = data.length;
        this.ongoingCount = data.filter(p => p.status === 'ongoing').length;
        this.completedCount = data.filter(p => p.status === 'completed').length;
      }
    });
  }

  isEnrolled(batchNo: string): boolean {
    return this.enrolledBatchNos.has(batchNo);
  }

  enroll(programme: OngoingProgramme): void {
    if (this.enrollingBatchNo) return;

    this.enrollingBatchNo = programme.programmeId;
    this.enrollFeedback = null;

    this.participantService.enroll(programme.programmeId).subscribe({
      next: (res) => {
        this.enrolledBatchNos.add(programme.programmeId);
        this.totalEnrolled++;
        this.enrollFeedback = { batchNo: programme.programmeId, success: true, message: res.message };
        this.enrollingBatchNo = null;
        setTimeout(() => { this.enrollFeedback = null; }, 4000);
      },
      error: (err) => {
        const message = err?.error?.message ?? 'Enrollment failed. Please try again.';
        this.enrollFeedback = { batchNo: programme.programmeId, success: false, message };
        this.enrollingBatchNo = null;
        setTimeout(() => { this.enrollFeedback = null; }, 4000);
      }
    });
  }

  get hasApplied(): boolean {
    return false;
  }

  get participantStatus(): string | null {
    return this.applicationStatus?.participantStatus ?? null;
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
