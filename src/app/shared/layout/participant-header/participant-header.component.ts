import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { HelperService } from '../../../services/helper.service';
import { OrgCategoryService } from '../../../services/org-category.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-participant-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './participant-header.component.html',
})
export class ParticipantHeaderComponent implements OnInit {

  readonly isMobileOpen$;
  isDropdownOpen = false;
  userName = '';
  userEmail = '';
  userInitial = '';
  categoryLogoUrl: string | null = null;

  private readonly apiBase = environment.apiurl.replace(/\/api$/, '');

  constructor(
    public sidebarService: SidebarService,
    private helper: HelperService,
    private orgCategoryService: OrgCategoryService
  ) {
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
      this.loadCategoryLogo(user.orgCategory);
    }
  }

  private loadCategoryLogo(orgCategory: string) {
    if (!orgCategory) return;
    this.orgCategoryService.getCategories().subscribe({
      next: (categories: any[]) => {
        const match = categories.find(c => c.value === orgCategory || c.label === orgCategory);
        if (match?.logoPath) {
          this.categoryLogoUrl = `${this.apiBase}/${match.logoPath.replace(/\\/g, '/')}`;
        }
      }
    });
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
