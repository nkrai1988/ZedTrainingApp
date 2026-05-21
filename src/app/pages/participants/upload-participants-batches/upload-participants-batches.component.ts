import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { DataloadinprogressComponent } from '../../../shared/components/common/dataloadinprogress/dataloadinprogress.component';
import { DatanotfoundComponent } from '../../../shared/components/common/datanotfound/datanotfound.component';
import { ParticipantService } from '../../../services/participant.service';

@Component({
  selector: 'app-upload-participants-batches',
  imports: [
    CommonModule,
    RouterModule,
    ComponentCardComponent,
    DataloadinprogressComponent,
    DatanotfoundComponent,
  ],
  templateUrl: './upload-participants-batches.component.html',
  styleUrl: './upload-participants-batches.component.css',
})
export class UploadParticipantsBatchesComponent implements OnInit {
  dataRow: any[] = [];
  dataLoadProgress = false;
  errorMessage = '';

  constructor(private participantService: ParticipantService) {}

  ngOnInit(): void {
    this.loadBatches();
  }

  loadBatches(): void {
    this.dataLoadProgress = true;
    this.participantService.getUploadBatches().subscribe({
      next: (response: any[]) => {
        this.dataRow = response.filter((r: any) => r.started === 1 || r.started === true);
        this.dataLoadProgress = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load batches. Please try again.';
        this.dataLoadProgress = false;
      },
    });
  }
}
