import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeToggleButtonComponent } from '../../components/common/theme-toggle/theme-toggle-button.component';
import { NotificationDropdownComponent } from '../../components/header/notification-dropdown/notification-dropdown.component';
import { UserDropdownComponent } from '../../components/header/user-dropdown/user-dropdown.component';
import { PortaltabComponent } from '../portaltab/portaltab.component';
import { HelperService } from '../../../services/helper.service';
import { OrgCategoryService } from '../../../services/org-category.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterModule,
    ThemeToggleButtonComponent,
    NotificationDropdownComponent,
    UserDropdownComponent,
    PortaltabComponent
  ],
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent implements OnInit {
  isApplicationMenuOpen = false;
  isCategoryDropdownOpen = false;
  categories: any[] = [];
  selectedCategory: any = null;
  readonly isMobileOpen$;
  private subscription: Subscription = new Subscription();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('categoryDropdownEl') categoryDropdownEl!: ElementRef;

  constructor(
    public sidebarService: SidebarService,
    public helper: HelperService,
    private orgCategoryService: OrgCategoryService
  ) {
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  ngOnInit() {
    this.loadCategories();
    
  }

  loadCategories() {
    this.orgCategoryService.getCategories().subscribe({
      next: (res: any[]) => {
        this.categories = res.filter(c => c.isActive);
        let defaultCategory=this.categories[this.categories.length-1];
        this.selectCategory(defaultCategory);
      }
    });
  }

  toggleCategoryDropdown() {
    this.isCategoryDropdownOpen = !this.isCategoryDropdownOpen;
  }

  selectCategory(category: any) {
    this.selectedCategory = category;
    this.isCategoryDropdownOpen = false;
    this.helper.masterOrgCategory=category.value;
    this.helper.setOrgCategory(category.value);
  }

  clearCategory() {
    this.selectedCategory = null;
    this.isCategoryDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.categoryDropdownEl && !this.categoryDropdownEl.nativeElement.contains(event.target)) {
      this.isCategoryDropdownOpen = false;
    }
  }

  handleToggle() {
    if (window.innerWidth >= 1280) {
      this.sidebarService.toggleExpanded();
    } else {
      this.sidebarService.toggleMobileOpen();
    }
  }

  toggleApplicationMenu() {
    this.isApplicationMenuOpen = !this.isApplicationMenuOpen;
  }

  ngAfterViewInit() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.searchInput?.nativeElement.focus();
    }
  };
}
