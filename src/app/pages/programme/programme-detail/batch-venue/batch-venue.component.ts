import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchDetailService } from '../../../../services/batchdetail.service';
import { ComponentCardComponent } from '../../../../shared/components/common/component-card/component-card.component';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { API_STATIC_BASE } from '../../../../shared/constants/url.constants';

@Component({
  selector: 'app-batch-venue',
  imports: [CommonModule, ComponentCardComponent, LabelComponent],
  templateUrl: './batch-venue.component.html',
  styleUrl: './batch-venue.component.css',
})
export class BatchVenueComponent {

  constructor(private batchdetail: BatchDetailService) {}

  @Input() batchId = '';
  batchDetail: any = null;
  photos: string[] = [];
  staticBase = API_STATIC_BASE;
  selectedPhoto: string | null = null;

  ngOnInit() {
    if (this.batchId) {
      this.getBatchVenue();
    }
  }

  getBatchVenue() {
    this.batchdetail.getBatchVenue(this.batchId).subscribe({
      next: (res: any) => {
        if (res.venue?.length) {
          this.batchDetail = res.venue[0];
        }
        this.photos = res.photos ?? [];
      },
      error: () => {}
    });
  }
}
