import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BatchDetailService } from '../../../../services/batchdetail.service';
import { ComponentCardComponent } from '../../../../shared/components/common/component-card/component-card.component';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { API_STATIC_BASE } from '../../../../shared/constants/url.constants';

@Component({
  selector: 'app-batch-venue',
  imports: [CommonModule, FormsModule, ComponentCardComponent, LabelComponent],
  templateUrl: './batch-venue.component.html',
  styleUrl: './batch-venue.component.css',
})
export class BatchVenueComponent {

  constructor(private batchdetail: BatchDetailService) {}

  @Input() batchId = '';
  @Output() venueLoaded = new EventEmitter<any>();
  batchDetail: any = null;
  photos: string[] = [];
  attendancePhotos: any[] = [];
  staticBase = API_STATIC_BASE;
  selectedPhoto: string | null = null;

  showEditModal = false;
  editVenueName = '';
  editZip = '';
  saving = false;

  ngOnInit() {
    if (this.batchId) {
      this.getBatchVenue();
      this.getAttendancePhotos();
    }
  }

  getBatchVenue() {
    this.batchdetail.getBatchVenue(this.batchId).subscribe({
      next: (res: any) => {
        if (res.venue?.length) {
          this.batchDetail = res.venue[0];
          this.venueLoaded.emit(this.batchDetail);
        }
        this.photos = res.photos ?? [];
      },
      error: () => {}
    });
  }

  getAttendancePhotos() {
    this.batchdetail.getBatchAttendancePhotoList(this.batchId).subscribe({
      next: (res: any) => { this.attendancePhotos = res ?? []; },
      error: () => {}
    });
  }

  openEditModal() {
    this.editVenueName = this.batchDetail?.venueName ?? '';
    this.editZip = this.batchDetail?.zip ?? '';
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  saveVenue() {
    if (!this.editVenueName.trim()) return;
    this.saving = true;
    this.batchdetail.updateVenue(this.batchId, this.editVenueName.trim(), this.editZip.trim()).subscribe({
      next: () => {
        this.batchDetail = { ...this.batchDetail, venueName: this.editVenueName.trim(), zip: this.editZip.trim() };
        this.venueLoaded.emit(this.batchDetail);
        this.saving = false;
        this.showEditModal = false;
      },
      error: () => { this.saving = false; }
    });
  }
}
