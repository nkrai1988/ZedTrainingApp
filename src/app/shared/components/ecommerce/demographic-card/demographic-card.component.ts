import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { DropdownItemComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component';
import { CountryMapComponent } from '../country-map/country-map.component';

@Component({
  selector: 'app-demographic-card',
  imports: [
    CommonModule,
    CountryMapComponent,
    DropdownComponent,
    
  ],
  templateUrl: './demographic-card.component.html',
})
export class DemographicCardComponent {
  isOpen = false;
  @Input() allLocation:any[]=[];

  ngOnInit(){
    console.log({'allLocation':this.allLocation});
  }
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  countries = [
    {
      img: '/images/country/country-01.svg',
      alt: 'up',
      name: 'UP',
      customers: '2,379 Programmes',
      percent: 79,
    },
    {
      img: '/images/country/country-02.svg',
      alt: 'delhi',
      name: 'Delhi',
      customers: '589 Programmes',
      percent: 23,
    }
    
  ];
}
