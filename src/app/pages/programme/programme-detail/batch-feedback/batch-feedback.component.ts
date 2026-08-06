import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchDetailService } from '../../../../services/batchdetail.service';

@Component({
  selector: 'app-batch-feedback',
  imports: [CommonModule],
  templateUrl: './batch-feedback.component.html',
  styleUrl: './batch-feedback.component.css',
})
export class BatchFeedbackComponent {
constructor(private batchdetail:BatchDetailService){
    
  }

  @Input() batchId='';
  dataRow:any=[];

  ngOnInit(){
      if(this.batchId){
        this.getFeedbacks();
      }
    }


    getFeedbacks(){
        this.batchdetail.getBatchFeedbacksList(this.batchId).subscribe({
          next:(res:any)=>{        
            console.log({'getBatchFeedbacksList':res});
            this.dataRow = res;
          },
          error:(err:any)=>{
    
          }
        })
      }
}
