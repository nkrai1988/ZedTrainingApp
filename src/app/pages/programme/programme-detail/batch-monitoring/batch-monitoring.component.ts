import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchDetailService } from '../../../../services/batchdetail.service';
import { API_STATIC_BASE } from '../../../../shared/constants/url.constants';

@Component({
  selector: 'app-batch-monitoring',
  imports: [CommonModule],
  templateUrl: './batch-monitoring.component.html',
  styleUrl: './batch-monitoring.component.css',
})
export class BatchMonitoringComponent {

  constructor(private batchdetail:BatchDetailService){
  
    }

  dataRow:any=[];
  staticBase = API_STATIC_BASE;
  selectedPhoto: string | null = null;

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
