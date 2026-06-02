import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { DataloadinprogressComponent } from '../../../shared/components/common/dataloadinprogress/dataloadinprogress.component';
import { DatanotfoundComponent } from '../../../shared/components/common/datanotfound/datanotfound.component';
import { OrgCategoryService } from '../../../services/org-category.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-category-list',
  imports: [
    CommonModule,
    RouterModule,
    ComponentCardComponent,
    BadgeComponent,
    AlertComponent,
    ButtonComponent,
    ModalComponent,
    DataloadinprogressComponent,
    DatanotfoundComponent
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {

  dataRow: any[] = [];
  dataLoadProgress = false;
  successmessage = '';
  errormessage = '';

  isLogoModalOpen = false;
  selectedCategory: any = null;
  selectedLogoFile: File | null = null;
  logoPreviewUrl: string | null = null;
  logoUploading = false;

  private apiBase = environment.apiurl.replace(/\/api$/, '');

  constructor(private orgCategoryService: OrgCategoryService) {}

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.dataLoadProgress = true;
    this.orgCategoryService.getCategories().subscribe({
      next: (res: any[]) => {
        this.dataRow = res;
        this.dataLoadProgress = false;
      },
      error: () => {
        this.dataLoadProgress = false;
      }
    });
  }

  toggleStatus(cat: any) {
    const action = cat.isActive ? 'Deactivate' : 'Activate';
    if (confirm(`${action} the category "${cat.label}"?`)) {
      this.orgCategoryService.toggleStatus(cat.id).subscribe({
        next: (res: any) => {
          cat.isActive = res.isActive;
          this.successmessage = `Category "${cat.label}" ${res.isActive ? 'activated' : 'deactivated'} successfully.`;
          setTimeout(() => this.successmessage = '', 4000);
        }
      });
    }
  }

  getStatusBadgeColor(isActive: boolean): 'success' | 'error' {
    return isActive ? 'success' : 'error';
  }

  getLogoUrl(logoPath: string): string {
    return `${this.apiBase}/${logoPath.replace(/\\/g, '/')}`;
  }

  openLogoModal(cat: any) {
    this.selectedCategory = cat;
    this.selectedLogoFile = null;
    this.logoPreviewUrl = cat.logoPath ? this.getLogoUrl(cat.logoPath) : null;
    this.isLogoModalOpen = true;
  }

  closeLogoModal() {
    this.isLogoModalOpen = false;
    this.selectedCategory = null;
    this.selectedLogoFile = null;
    this.logoPreviewUrl = null;
  }

  onLogoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
    if (!allowed.includes(file.type)) {
      this.errormessage = 'Only image files are allowed (jpg, png, gif, svg, webp).';
      setTimeout(() => this.errormessage = '', 4000);
      input.value = '';
      return;
    }

    this.selectedLogoFile = file;
    const reader = new FileReader();
    reader.onload = () => { this.logoPreviewUrl = reader.result as string; };
    reader.readAsDataURL(file);
  }

  removeLogo(logoInput: HTMLInputElement) {
    this.selectedLogoFile = null;
    this.logoPreviewUrl = this.selectedCategory?.logoPath
      ? this.getLogoUrl(this.selectedCategory.logoPath)
      : null;
    logoInput.value = '';
  }

  uploadLogo(logoInput: HTMLInputElement) {
    if (!this.selectedLogoFile || !this.selectedCategory) return;

    this.logoUploading = true;
    this.orgCategoryService.uploadLogo(this.selectedCategory.id, this.selectedLogoFile).subscribe({
      next: (res: any) => {
        this.selectedCategory.logoPath = res.logoPath;
        this.logoUploading = false;
        this.successmessage = `Logo updated for "${this.selectedCategory.label}".`;
        setTimeout(() => this.successmessage = '', 4000);
        this.closeLogoModal();
      },
      error: () => {
        this.logoUploading = false;
        this.errormessage = 'Failed to upload logo. Please try again.';
        setTimeout(() => this.errormessage = '', 4000);
      }
    });
  }
}
