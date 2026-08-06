import { Component, Input } from '@angular/core';
import { BatchDetailService } from '../../../../services/batchdetail.service';
import { CommonModule } from '@angular/common';
import { API_STATIC_BASE } from '../../../../shared/constants/url.constants';

@Component({
  selector: 'app-batch-participants',
  imports: [CommonModule],
  templateUrl: './batch-participants.component.html',
  styleUrl: './batch-participants.component.css',
})
export class BatchParticipantsComponent {

  constructor(private batchdetail: BatchDetailService) {}

  @Input() batchId = '';
  dataRow: any[] = [];
  staticBase = API_STATIC_BASE;

  ngOnInit() {
    if (this.batchId) {
      this.getParticipants();
    }
  }

  getParticipants() {
    this.batchdetail.getBatchParticipantList(this.batchId).subscribe({
      next: (res: any) => {
        this.dataRow = res;
      },
      error: (err: any) => {}
    });
  }
}
