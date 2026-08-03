import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticipantService } from '../../../services/participant.service';
import { APPURLs } from '../../../shared/constants/url.constants';

interface MyCertificate {
  batchNo: string;
  candidateId: string;
  programmeName: string;
  qpCode: string | null;
  issuedOn: string | null;
}

@Component({
  selector: 'app-my-certificates',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-certificates.component.html',
})
export class MyCertificatesComponent implements OnInit {

  searchText = '';
  certificates: MyCertificate[] = [];
  loading = true;
  errorMessage = '';

  constructor(private participantService: ParticipantService) {}

  ngOnInit(): void {
    this.participantService.getMyCertificates().subscribe({
      next: (data) => {
        this.certificates = data ?? [];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load certificates. Please try again.';
        this.loading = false;
      }
    });
  }

  get totalCount(): number { return this.certificates.length; }

  get filteredCertificates(): MyCertificate[] {
    const q = this.searchText.trim().toLowerCase();
    if (!q) return this.certificates;
    return this.certificates.filter(c =>
      (c.programmeName ?? '').toLowerCase().includes(q) ||
      (c.batchNo ?? '').toLowerCase().includes(q) ||
      (c.qpCode ?? '').toLowerCase().includes(q)
    );
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  downloadCertificate(cert: MyCertificate): void {
    const url = `${APPURLs.base}${APPURLs.certificateDownload}?batchNo=${cert.batchNo}&participantId=${cert.candidateId}`;
    window.open(url, '_blank');
  }
}
