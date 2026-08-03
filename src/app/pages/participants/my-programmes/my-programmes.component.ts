import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MyProgramme, ParticipantService } from '../../../services/participant.service';
@Component({
  selector: 'app-my-programmes',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './my-programmes.component.html',
})
export class MyProgrammesComponent implements OnInit {

  searchText = '';
  statusFilter = 'all';

  programmes: MyProgramme[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private participantService: ParticipantService) {}

  ngOnInit(): void {
    this.participantService.getMyEnrolledProgrammes().subscribe({
      next: (data) => {
        this.programmes = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load programmes. Please try again.';
        this.isLoading = false;
      },
    });
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
