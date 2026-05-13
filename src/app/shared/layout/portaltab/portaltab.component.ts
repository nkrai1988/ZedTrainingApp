// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-portaltab',
//   imports: [],
//   templateUrl: './portaltab.component.html',
//   styleUrl: './portaltab.component.css',
// })
// export class PortaltabComponent {

// }


import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HelperService } from '../../../services/helper.service';
import { Router } from '@angular/router';

type TabOption = 'training' | 'professional' | 'qmp'| 'assessor';

@Component({
  selector: 'app-portaltab',
  imports: [CommonModule],
  templateUrl: './portaltab.component.html'
})
export class PortaltabComponent {

  constructor(private helper:HelperService,private router:Router){

  }

  ngOnInit(){
    console.log({'IsAssessor':this.helper.IsAssessor()});
  }
  selected: TabOption = 'training';

  setSelected(option: TabOption) {
    //console.log({'option':option});
    this.helper.setPortal(option);
    if(option == 'training'){
      this.router.navigate(['dashboard']);
    }

    if(option == 'professional'){
      this.router.navigate(['prodashboard']);
    }

    if(option == 'qmp'){
      this.router.navigate(['qmpdashboard']);
    }

    this.selected = option;
  }

  getButtonClass(option: TabOption): string {
    return this.selected === option
      ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800'
      : 'text-gray-500 dark:text-gray-400';
  }
}
