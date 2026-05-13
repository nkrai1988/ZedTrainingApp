import { Component, Input } from '@angular/core';
import { BatchDetailService } from '../../../../services/batchdetail.service';

@Component({
  selector: 'app-batch-monitoring',
  imports: [],
  templateUrl: './batch-monitoring.component.html',
  styleUrl: './batch-monitoring.component.css',
})
export class BatchMonitoringComponent {

  constructor(private batchdetail:BatchDetailService){
  
    }

  dataRow:any=[];

  @Input() batchId='';
  ngOnInit(){
    if(this.batchId){
      this.getBatchMonitoring();
    }
  }

  getBatchMonitoring(){
    this.batchdetail.getBatchMonitoringList(this.batchId).subscribe({
      next:(res:any)=>{        
        console.log({'getBatchMonitoring9999':res});
        this.dataRow = res;
      },
      error:(err:any)=>{

      }
    })
  }

}
