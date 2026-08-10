

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HelperService } from '../../../services/helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BatchDetailService } from '../../../services/batchdetail.service';
import { BatchVenueComponent } from './batch-venue/batch-venue.component';
import { BatchParticipantsComponent } from './batch-participants/batch-participants.component';
import { BatchMonitoringComponent } from './batch-monitoring/batch-monitoring.component';
import { BatchAttendanceComponent } from './batch-attendance/batch-attendance.component';
import { BatchTrainersComponent } from './batch-trainers/batch-trainers.component';
import { BatchFeedbackComponent } from './batch-feedback/batch-feedback.component';

type TabOption = 'Venue' | 'Participants' | 'Monitoring'| 'Attendance' | 'Trainers' | 'Feedback';

@Component({
  selector: 'app-programme-detail',
  imports: [CommonModule,BatchVenueComponent,BatchParticipantsComponent,BatchMonitoringComponent,BatchAttendanceComponent,BatchTrainersComponent,BatchFeedbackComponent],
  templateUrl: './programme-detail.component.html',
  styleUrl: './programme-detail.component.css',
})
export class ProgrammeDetailComponent {

  constructor(private helper:HelperService, private route:ActivatedRoute, private batchdetail: BatchDetailService){}

  programmeId='';
  programmeInfo: any = null;
  exportingExcel = false;

  ngOnInit(){
    this.route.queryParams.subscribe(params=>{
      this.programmeId = params['batchid'];
    })
  }

  onVenueLoaded(data: any) {
    this.programmeInfo = data;
  }

  selected: TabOption = 'Venue';

  exportExcel() {
    if (!this.programmeId || this.exportingExcel) return;
    this.exportingExcel = true;
    this.batchdetail.exportExcel(this.programmeId).subscribe({
      next: (res) => {
        const blob = res.body!;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ProgrammeDetails_${this.programmeId}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.exportingExcel = false;
      },
      error: () => { this.exportingExcel = false; }
    });
  }

  setSelected(option: TabOption) {
    //console.log({'option':option});
    //this.helper.setPortal(option);
    // if(option == 'Venue'){
    //   //this.router.navigate(['dashboard']);
    // }

    // if(option == 'Participants'){
    //   //this.router.navigate(['prodashboard']);
    // }

    // if(option == 'Monitoring'){
    //   //this.router.navigate(['qmpdashboard']);
    // } 

     this.selected = option;
  }

  getButtonClass(option: TabOption): string {
    return this.selected === option
      ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800'
      : 'text-gray-500 dark:text-gray-400';
  }
}

