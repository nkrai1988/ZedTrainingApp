import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { DataloadinprogressComponent } from '../../../shared/components/common/dataloadinprogress/dataloadinprogress.component';
import { DatanotfoundComponent } from '../../../shared/components/common/datanotfound/datanotfound.component';
import { CategoryAdminService } from '../../../services/category-admin.service';

@Component({
  selector: 'app-category-admin-list',
  imports: [
    CommonModule,
    RouterModule,
    ComponentCardComponent,
    BadgeComponent,
    AlertComponent,
    DataloadinprogressComponent,
    DatanotfoundComponent
  ],
  templateUrl: './category-admin-list.component.html',
  styleUrl: './category-admin-list.component.css'
})
export class CategoryAdminListComponent implements OnInit {

  dataRow: any[] = [];
  dataLoadProgress = false;
  successmessage = '';

  constructor(private categoryAdminService: CategoryAdminService) {}

  ngOnInit() {
    this.loadAdmins();
  }

  loadAdmins() {
    this.dataLoadProgress = true;
    this.categoryAdminService.getAdmins().subscribe({
      next: (res: any[]) => {
        this.dataRow = res;
        this.dataLoadProgress = false;
      },
      error: () => {
        this.dataLoadProgress = false;
      }
    });
  }

  toggleStatus(admin: any) {
    const action = admin.isActive ? 'Deactivate' : 'Activate';
    if (confirm(`${action} admin "${admin.firstName} ${admin.lastName}"?`)) {
      this.categoryAdminService.toggleStatus(admin.id).subscribe({
        next: (res: any) => {
          admin.isActive = res.isActive;
          this.successmessage = `Admin "${admin.firstName} ${admin.lastName}" ${res.isActive ? 'activated' : 'deactivated'} successfully.`;
          setTimeout(() => this.successmessage = '', 4000);
        }
      });
    }
  }

  getStatusBadgeColor(isActive: boolean): 'success' | 'error' {
    return isActive ? 'success' : 'error';
  }
}
