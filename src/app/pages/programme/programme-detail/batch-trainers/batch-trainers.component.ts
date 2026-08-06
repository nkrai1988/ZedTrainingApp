import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchDetailService } from '../../../../services/batchdetail.service';
import { ComponentCardComponent } from '../../../../shared/components/common/component-card/component-card.component';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { API_STATIC_BASE } from '../../../../shared/constants/url.constants';

@Component({
  selector: 'app-batch-trainers',
  imports: [CommonModule, ComponentCardComponent, LabelComponent],
  templateUrl: './batch-trainers.component.html',
  styleUrl: './batch-trainers.component.css',
})
export class BatchTrainersComponent {

  constructor(private batchdetail: BatchDetailService) {}

  @Input() batchId = '';
  dataRow: any[] = [];
  staticBase = API_STATIC_BASE;
  selectedPhoto: string | null = null;

  ngOnInit(){
      if(this.batchId){
        this.getTrainers();
      }
    }


    getTrainers(){
        this.batchdetail.getBatchTrainerList(this.batchId).subscribe({
          next:(res:any)=>{        
            console.log({'getBatchTrainerList':res});
            this.dataRow = res;
          },
          error:(err:any)=>{
    
          }
        })
      }

}
