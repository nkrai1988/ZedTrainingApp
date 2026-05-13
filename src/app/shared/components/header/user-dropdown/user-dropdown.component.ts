import { Component, Inject } from '@angular/core';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DropdownItemTwoComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component-two';
import { HelperService } from '../../../../services/helper.service';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  imports:[CommonModule,RouterModule,DropdownComponent,DropdownItemTwoComponent]
})
export class UserDropdownComponent {
  isOpen = false;
  //private helper = Inject(HelperService);
  userEmail='';
  userName='';
  constructor(private helper:HelperService){

  }
  ngOnInit(){
    let user = this.helper.getUser();
    console.log({'user':user});
    this.userEmail=user.email;
    this.userName=user.name;
  }
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  logout(){
    this.helper.userLogOut();
  }
}