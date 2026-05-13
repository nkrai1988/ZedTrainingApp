import { Component, Input } from '@angular/core';
import { BatchDetailService } from '../../../../services/batchdetail.service';
import { ComponentCardComponent } from '../../../../shared/components/common/component-card/component-card.component';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';

@Component({
  selector: 'app-batch-venue',
  imports: [ComponentCardComponent,LabelComponent],
  templateUrl: './batch-venue.component.html',
  styleUrl: './batch-venue.component.css',
})
export class BatchVenueComponent {

  constructor(private batchdetail:BatchDetailService){

  }

  @Input() batchId='';
  batchDetail:any=null;

  ngOnInit(){
    
    if(this.batchId){

      this.getBatchVenue();
    }
  }

  getBatchVenue(){
    this.batchdetail.getBatchVenue(this.batchId).subscribe({
      next:(res:any)=>{        
        if(res.length){
          this.batchDetail = res[0];
        }
      },
      error:(err:any)=>{

      }
    })
  }

}
