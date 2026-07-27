import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Certificate {
  id: number;
  programmeName: string;
  certificateNo: string;
  issuedOn: string;
  expiresOn: string;
  isValid: boolean;
}

import { AppFooterComponent } from '../../../shared/components/common/app-footer/app-footer.component';

@Component({
  selector: 'app-my-certificates',
  imports: [CommonModule, FormsModule, AppFooterComponent],
  templateUrl: './my-certificates.component.html',
})
export class MyCertificatesComponent {

  searchText = '';
  statusFilter = 'all';

  certificates: Certificate[] = [
    {
      id: 1,
      programmeName: '5-Day Assessors Training Program',
      certificateNo: 'BA20251034204235',
      issuedOn: '19/12/2025',
      expiresOn: '19/12/2028',
      isValid: true,
    },
    {
      id: 2,
      programmeName: '5-Day Assessors Training Program',
      certificateNo: 'BA20251034204235',
      issuedOn: '19/12/2025',
      expiresOn: '19/12/2028',
      isValid: true,
    },
    {
      id: 3,
      programmeName: '5-Day Assessors Training Program',
      certificateNo: 'BA20251034204236',
      issuedOn: '10/05/2023',
      expiresOn: '10/05/2026',
      isValid: true,
    },
    {
      id: 4,
      programmeName: '5-Day Assessors Training Program',
      certificateNo: 'BA20251034204237',
      issuedOn: '01/03/2021',
      expiresOn: '01/03/2024',
      isValid: false,
    },
    {
      id: 5,
      programmeName: '5-Day Assessors Training Program',
      certificateNo: 'BA20251034204238',
      issuedOn: '15/07/2025',
      expiresOn: '15/07/2028',
      isValid: true,
    },
  ];

  get totalCount(): number { return this.certificates.length; }
  get validCount(): number  { return this.certificates.filter(c => c.isValid).length; }
  get expiredCount(): number { return this.certificates.filter(c => !c.isValid).length; }

  get filteredCertificates(): Certificate[] {
    let result = this.certificates;

    if (this.statusFilter === 'valid') {
      result = result.filter(c => c.isValid);
    } else if (this.statusFilter === 'expired') {
      result = result.filter(c => !c.isValid);
    }

    const q = this.searchText.trim().toLowerCase();
    if (q) {
      result = result.filter(c =>
        c.programmeName.toLowerCase().includes(q) ||
        c.certificateNo.toLowerCase().includes(q)
      );
    }

    return result;
  }
}
