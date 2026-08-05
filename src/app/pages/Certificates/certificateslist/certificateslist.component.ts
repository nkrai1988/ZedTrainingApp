import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { HelperService } from '../../../services/helper.service';
import { CertificateService } from '../../../services/certificates.service';
import { DataloadinprogressComponent } from '../../../shared/components/common/dataloadinprogress/dataloadinprogress.component';
import { DatanotfoundComponent } from '../../../shared/components/common/datanotfound/datanotfound.component';

@Component({
  selector: 'app-certificateslist',
  imports: [
    ComponentCardComponent,
    CommonModule,
    AlertComponent,
    DataloadinprogressComponent,
    DatanotfoundComponent,
  ],
  templateUrl: './certificateslist.component.html',
  styleUrl: './certificateslist.component.css',
})
export class CertificateslistComponent implements OnInit, OnDestroy {
  constructor(private service: CertificateService, private helperService: HelperService) {}

  private currentCategoryId: number | null = null;
  private currentSubCategoryId: number | null = null;
  private subscription: Subscription = new Subscription();

  dataLoadProgress = false;
  showParticipants = false;
  dataRow: any[] = [];
  participantsdataRow: any[] = [];
  selectedBatch: any;
  successmessage = '';
  errormessage = '';
  generatingId: any = null;

  ngOnInit() {
    if (this.helperService.IsSuperAdmin()) {
      this.subscription.add(
        combineLatest([this.helperService.category$, this.helperService.subCategory$])
          .subscribe(([category, subCategory]) => {
            this.currentCategoryId = category;
            this.currentSubCategoryId = subCategory;
            this.getCertificate();
          })
      );
    } else if (this.helperService.IsCategoryAdmin()) {
      const stored = localStorage.getItem('user');
      if (stored) this.currentCategoryId = JSON.parse(stored)?.orgCategoryId ?? null;
      this.subscription.add(
        this.helperService.subCategory$.subscribe(subCategory => {
          this.currentSubCategoryId = subCategory;
          this.getCertificate();
        })
      );
    } else {
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        this.currentCategoryId = u?.orgCategoryId ?? null;
        this.currentSubCategoryId = u?.selectedSubCategoryId ?? null;
      }
      this.getCertificate();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getCertificate() {
    this.dataLoadProgress = true;
    this.dataRow = [];
    this.service.getCertificateList(this.currentCategoryId, this.currentSubCategoryId).subscribe({
      next: (response: any[]) => {
        this.dataRow = response;
        this.dataLoadProgress = false;
      },
      error: (_err: any) => {
        this.dataLoadProgress = false;
      }
    });
  }

  getPaticipants(row: any) {
    this.selectedBatch = row;
    this.participantsdataRow = [];
    this.dataLoadProgress = true;
    this.showParticipants = true;
    this.service.getParticipantsList(row.programmeID).subscribe({
      next: (response: any[]) => {
        this.participantsdataRow = response;
        this.dataLoadProgress = false;
      },
      error: (_err: any) => {
        this.dataLoadProgress = false;
      }
    });
  }

  getCertificateDetail(row: any) {
    this.errormessage = '';
    this.generatingId = row.id;
    this.service.generateCertificate(this.selectedBatch.programmeID, row.id).subscribe({
      next: (_res: any) => {
        this.service.downloadCertificate(this.selectedBatch.programmeID, row.id).subscribe({
          next: (response: any) => {
            this.generatingId = null;
            const blob = response.body as Blob;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.selectedBatch.programmeID}_${row.id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
          },
          error: (_err: any) => {
            this.generatingId = null;
            this.errormessage = 'Failed to download certificate.';
          }
        });
      },
      error: (err: any) => {
        this.generatingId = null;
        this.errormessage = err?.error?.message || 'Failed to generate certificate.';
      }
    });
  }

  backToProgramme() {
    this.showParticipants = false;
    this.participantsdataRow = [];
  }
}
