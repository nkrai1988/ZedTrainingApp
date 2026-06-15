import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { DataloadinprogressComponent } from '../../../shared/components/common/dataloadinprogress/dataloadinprogress.component';
import { DatanotfoundComponent } from '../../../shared/components/common/datanotfound/datanotfound.component';
import { PracticalScoresService, PracticalScoresBatch } from '../../../services/practical-scores.service';

@Component({
  selector: 'app-practical-scores-batches',
  imports: [
    CommonModule,
    RouterModule,
    ComponentCardComponent,
    DataloadinprogressComponent,
    DatanotfoundComponent,
  ],
  templateUrl: './practical-scores-batches.component.html',
  styleUrl: './practical-scores-batches.component.css',
})
export class PracticalScoresBatchesComponent implements OnInit {
  batches: PracticalScoresBatch[] = [];
  dataLoadProgress = false;
  errorMessage = '';

  constructor(private practicalScoresService: PracticalScoresService) {}

  ngOnInit(): void {
    this.loadBatches();
  }

  loadBatches(): void {
    this.dataLoadProgress = true;
    this.practicalScoresService.getBatches().subscribe({
      next: (data) => {
        this.batches = data;
        this.dataLoadProgress = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load batches. Please try again.';
        this.dataLoadProgress = false;
      },
    });
  }
}
