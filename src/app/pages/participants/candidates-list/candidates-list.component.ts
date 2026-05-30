import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ParticipantService, CandidatesFilter, CandidatesResult } from '../../../services/participant.service';

@Component({
  selector: 'app-candidates-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './candidates-list.component.html',
  styleUrls: ['./candidates-list.component.css']
})
export class CandidatesListComponent implements OnInit {
  candidates: Record<string, any>[] = [];
  totalCount = 0;
  loading = false;
  errorMessage = '';

  filter: CandidatesFilter = {
    applyingFor: '',
    orgPartnerId: '',
    isBlocked: false,
    searchText: '',
    page: 1,
    pageSize: 20
  };

  applyingForOptions = ['', 'Assessor', 'Consultant', 'Master Trainer'];

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.filter.pageSize);
  }

  get columnKeys(): string[] {
    if (!this.candidates.length) return [];
    return Object.keys(this.candidates[0]).filter(k => k !== 'TotalCount');
  }

  constructor(private participantService: ParticipantService) {}

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.loading = true;
    this.errorMessage = '';

    this.participantService.getCandidates(this.filter).subscribe({
      next: (res: CandidatesResult) => {
        this.loading = false;
        this.candidates = res.data ?? [];
        this.totalCount = res.totalCount ?? 0;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message ?? 'Failed to load candidates.';
      }
    });
  }

  applyFilters(): void {
    this.filter.page = 1;
    this.loadCandidates();
  }

  resetFilters(): void {
    this.filter = {
      applyingFor: '',
      orgPartnerId: '',
      isBlocked: false,
      searchText: '',
      page: 1,
      pageSize: 20
    };
    this.loadCandidates();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.filter.page = page;
    this.loadCandidates();
  }

  formatValue(val: any): string {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    return String(val);
  }
}
