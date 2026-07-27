import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ParticipantService, ApplicationStatus } from '../../../services/participant.service';
import { AppFooterComponent } from '../../../shared/components/common/app-footer/app-footer.component';

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
  imports: [CommonModule, RouterModule, AppFooterComponent],
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
  }

  get hasApplied(): boolean {
    return false;//return this.applicationStatus?.hasApplied ?? false;
  }

  get participantStatus(): string | null {
    return this.applicationStatus?.participantStatus ?? null;
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
