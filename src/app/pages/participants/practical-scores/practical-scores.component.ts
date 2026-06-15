import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { DataloadinprogressComponent } from '../../../shared/components/common/dataloadinprogress/dataloadinprogress.component';
import { DatanotfoundComponent } from '../../../shared/components/common/datanotfound/datanotfound.component';
import {
  PracticalScoresService,
  CandidatePracticalScore,
} from '../../../services/practical-scores.service';
import { ApiService } from '../../../shared/services/api.service';
import { APPURLs } from '../../../shared/constants/url.constants';

@Component({
  selector: 'app-practical-scores',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ComponentCardComponent,
    DataloadinprogressComponent,
    DatanotfoundComponent,
  ],
  templateUrl: './practical-scores.component.html',
  styleUrl: './practical-scores.component.css',
})
export class PracticalScoresComponent implements OnInit {
  batchNo = '';
  venue: any = null;
  participants: CandidatePracticalScore[] = [];
  alreadySubmitted = false;

  dataLoadProgress = false;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private practicalScoresService: PracticalScoresService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.batchNo = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadData();
  }

  loadData(): void {
    this.dataLoadProgress = true;
    this.errorMessage = '';

    this.api.getSimple(`${APPURLs.batchdetailVenue}?batchid=${this.batchNo}`).subscribe({
      next: (data: any[]) => {
        this.venue = data?.[0] ?? null;
      },
    });

    this.practicalScoresService.getScores(this.batchNo).subscribe({
      next: (response) => {
        this.participants = response.participants;
        this.alreadySubmitted = response.alreadySubmitted;
        this.dataLoadProgress = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load participants. Please try again.';
        this.dataLoadProgress = false;
      },
    });
  }

  submitScores(): void {
    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.practicalScoresService
      .submitScores({ batchNo: this.batchNo, scores: this.participants })
      .subscribe({
        next: () => {
          this.successMessage = 'Practical scores updated successfully.';
          this.alreadySubmitted = true;
          this.submitting = false;
        },
        error: () => {
          this.errorMessage = 'Failed to submit scores. Please try again.';
          this.submitting = false;
        },
      });
  }
}
