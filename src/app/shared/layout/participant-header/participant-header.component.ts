import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { HelperService } from '../../../services/helper.service';

@Component({
  selector: 'app-participant-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './participant-header.component.html',
})
export class ParticipantHeaderComponent {

  readonly isMobileOpen$;
  isDropdownOpen = false;
  userName = '';
  userEmail = '';
  userInitial = '';

  constructor(public sidebarService: SidebarService, private helper: HelperService) {
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  ngOnInit() {
    const user = this.helper.getUser();
    if (user) {
      this.userEmail = user.email || '';
      const first = user.firstName || user.name || user.email || '';
      const last = user.lastName || '';
      this.userName = last ? `${first} ${last}`.trim() : first;
      this.userInitial = this.userName.charAt(0).toUpperCase() || 'P';
    }
  }

  handleToggle() {
    if (window.innerWidth >= 1280) {
      this.sidebarService.toggleExpanded();
    } else {
      this.sidebarService.toggleMobileOpen();
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  logout() {
    this.helper.userLogOut();
  }
}
