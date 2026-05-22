import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ParticipantService } from '../../../services/participant.service';
import { HelperService } from '../../../services/helper.service';

@Component({
  selector: 'app-participant-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './participant-dashboard.component.html',
})
export class ParticipantDashboardComponent implements OnInit {

  programmes: any[] = [];
  isLoading = true;
  hasError = false;
  userName = '';

  constructor(
    private participantService: ParticipantService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    const user = this.helperService.getUser();
    this.userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : '';
    this.loadMyProgrammes();
  }

  loadMyProgrammes() {
    this.isLoading = true;
    this.hasError = false;
    this.participantService.getMyEnrolledProgrammes().subscribe({
      next: (data: any[]) => {
        this.programmes = data || [];
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  get completedCount(): number {
    return this.programmes.filter(p => (p.status || '').toLowerCase() === 'completed').length;
  }

  get ongoingCount(): number {
    return this.programmes.filter(p => ['ongoing', 'active'].includes((p.status || '').toLowerCase())).length;
  }

  getStatusClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s === 'completed') return 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400';
    if (s === 'ongoing' || s === 'active') return 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400';
    if (s === 'upcoming') return 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400';
    return 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400';
  }

  logout() {
    this.helperService.userLogOut();
  }
}
