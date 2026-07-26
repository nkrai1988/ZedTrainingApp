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
import { environment } from '../../../../environments/environment';

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
  isSubCategoryDropdownOpen = false;
  categories: any[] = [];
  selectedCategory: any = null;
  subCategories: { id: number; label: string }[] = [];
  selectedSubCategory: { id: number; label: string } | null = null;

  // Category Admin sub-category filter
  catAdminSubCategories: { id: number; label: string }[] = [];
  selectedCatAdminSubCategory: { id: number; label: string } | null = null;
  isCatAdminSubCategoryDropdownOpen = false;

  // Coordinator / Agency category badge
  categoryLogoUrl: string | null = null;
  categoryName: string | null = null;
  private readonly apiBase = environment.apiurl.replace(/\/api$/, '');

  readonly isMobileOpen$;
  private subscription: Subscription = new Subscription();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('categoryDropdownEl') categoryDropdownEl!: ElementRef;
  @ViewChild('subCategoryDropdownEl') subCategoryDropdownEl!: ElementRef;
  @ViewChild('catAdminSubCategoryDropdownEl') catAdminSubCategoryDropdownEl!: ElementRef;

  constructor(
    public sidebarService: SidebarService,
    public helper: HelperService,
    private orgCategoryService: OrgCategoryService
  ) {
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  get roleTitle(): string {
    if (this.helper.IsSuperAdmin()) return 'MASTER ADMIN';
    if (this.helper.IsCategoryAdmin()) return 'CATEGORY ADMIN';
    if (this.helper.IsAgency()) return 'AGENCY DASHBOARD';
    if (this.helper.IsCoordinator()) return 'CO-ORDINATOR DASHBOARD';
    return 'DASHBOARD';
  }

  ngOnInit() {
    if (this.helper.IsSuperAdmin()) {
      this.loadCategories();
    }
    if (this.helper.IsCategoryAdmin()) {
      this.catAdminSubCategories = this.helper.getCategoryAdminSubCategories();
      if (this.catAdminSubCategories.length > 0) {
        this.selectCatAdminSubCategory(this.catAdminSubCategories[0]);
      }
    }
    if (this.helper.IsCoordinator() || this.helper.IsAgency()) {
      this.loadCategoryBadge();
    }
  }

  private loadCategoryBadge() {
    const user = this.helper.getUser();
    if (!user) return;
    this.categoryName = user.orgCategoryName || user.orgCategory || null;
    if (!user.orgCategory) return;
    this.orgCategoryService.getCategories().subscribe({
      next: (categories: any[]) => {
        const match = categories.find(c => c.value === user.orgCategory || c.label === user.orgCategory);
        if (match?.logoPath) {
          this.categoryLogoUrl = `${this.apiBase}/${match.logoPath.replace(/\\/g, '/')}`;
        }
      }
    });
  }

  loadCategories() {
    this.orgCategoryService.getCategories().subscribe({
      next: (res: any[]) => {
        this.categories = res.filter(c => c.isActive);
        let defaultCategory = this.categories[0];
        this.selectCategory(defaultCategory);
      }
    });
  }

  toggleCategoryDropdown() {
    this.isCategoryDropdownOpen = !this.isCategoryDropdownOpen;
    this.isSubCategoryDropdownOpen = false;
  }

  toggleSubCategoryDropdown() {
    this.isSubCategoryDropdownOpen = !this.isSubCategoryDropdownOpen;
    this.isCategoryDropdownOpen = false;
  }

  toggleCatAdminSubCategoryDropdown() {
    this.isCatAdminSubCategoryDropdownOpen = !this.isCatAdminSubCategoryDropdownOpen;
  }

  selectSubCategory(sub: { id: number; label: string }) {
    this.selectedSubCategory = sub;
    this.isSubCategoryDropdownOpen = false;
    this.helper.setOrgSubCategoryId(sub.id);
  }

  selectCatAdminSubCategory(sub: { id: number; label: string }) {
    this.selectedCatAdminSubCategory = sub;
    this.isCatAdminSubCategoryDropdownOpen = false;
    this.helper.setOrgSubCategoryId(sub.id);
  }

  clearCatAdminSubCategory() {
    this.selectedCatAdminSubCategory = null;
    this.isCatAdminSubCategoryDropdownOpen = false;
    this.helper.setOrgSubCategoryId(null);
  }

  selectCategory(category: any) {
    this.selectedCategory = category;
    this.isCategoryDropdownOpen = false;
    this.helper.masterOrgCategoryId = category.id;
    this.helper.setOrgCategoryId(category.id);
    this.helper.setOrgCategoryName(category.label);

    this.subCategories = (category.subCategories || [])
      .filter((s: any) => s.isActive)
      .map((s: any) => ({ id: s.id, label: s.label }));

    if (this.subCategories.length > 0) {
      this.selectSubCategory(this.subCategories[0]);
    } else {
      this.selectedSubCategory = null;
      this.helper.setOrgSubCategoryId(null);
    }
  }

  clearCategory() {
    this.selectedCategory = null;
    this.isCategoryDropdownOpen = false;
    this.helper.masterOrgCategoryId = null;
    this.helper.setOrgCategoryId(null);
    this.helper.setOrgCategoryName(null);
    this.subCategories = [];
    this.selectedSubCategory = null;
    this.helper.setOrgSubCategoryId(null);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.categoryDropdownEl && !this.categoryDropdownEl.nativeElement.contains(event.target)) {
      this.isCategoryDropdownOpen = false;
    }
    if (this.subCategoryDropdownEl && !this.subCategoryDropdownEl.nativeElement.contains(event.target)) {
      this.isSubCategoryDropdownOpen = false;
    }
    if (this.catAdminSubCategoryDropdownEl && !this.catAdminSubCategoryDropdownEl.nativeElement.contains(event.target)) {
      this.isCatAdminSubCategoryDropdownOpen = false;
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
