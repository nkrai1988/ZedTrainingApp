import { Component, Input } from '@angular/core';
import { BatchDetailService } from '../../../../services/batchdetail.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-batch-attendance',
  imports: [CommonModule],
  templateUrl: './batch-attendance.component.html',
  styleUrl: './batch-attendance.component.css',
})
export class BatchAttendanceComponent {
constructor(private batchdetail:BatchDetailService){
    
  }

  @Input() batchId='';
  dataRow:any=[];

  ngOnInit(){
      if(this.batchId){
        this.getAttendance();
      }
    }


    getAttendance(){
        this.batchdetail.getBatchAttendanceList(this.batchId).subscribe({
          next:(res:any)=>{        
            console.log({'getBatchFeedbacksList':res});
            this.dataRow = res;
          },
          error:(err:any)=>{
    
          }
        })
      }
}
