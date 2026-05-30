import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { DataloadinprogressComponent } from '../../../shared/components/common/dataloadinprogress/dataloadinprogress.component';
import { DatanotfoundComponent } from '../../../shared/components/common/datanotfound/datanotfound.component';
import { OrgCategoryService } from '../../../services/org-category.service';

@Component({
  selector: 'app-category-list',
  imports: [
    CommonModule,
    RouterModule,
    ComponentCardComponent,
    BadgeComponent,
    AlertComponent,
    ButtonComponent,
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
}
