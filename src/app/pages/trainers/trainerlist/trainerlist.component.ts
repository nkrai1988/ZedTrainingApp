import { Component, OnInit } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { RadioComponent } from '../../../shared/components/form/input/radio.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { ModalService } from '../../../shared/services/modal.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { Router, RouterModule } from '@angular/router';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { HelperService } from '../../../services/helper.service';
import { FacultyService } from '../../../services/faculty.service';
import { OrgCategoryService } from '../../../services/org-category.service';
import { DataloadinprogressComponent } from '../../../shared/components/common/dataloadinprogress/dataloadinprogress.component';
import { DatanotfoundComponent } from '../../../shared/components/common/datanotfound/datanotfound.component';

@Component({
  selector: 'app-trainerlist',
  imports: [
    ComponentCardComponent,
    BadgeComponent,
    FormsModule,
    RadioComponent,
    CommonModule,
    AlertComponent,
    ModalComponent,
    LabelComponent,
    ButtonComponent,
    RouterModule,
    DataloadinprogressComponent,
    DatanotfoundComponent,
  ],
  templateUrl: './trainerlist.component.html',
  styleUrl: './trainerlist.component.css',
})
export class TrainerlistComponent implements OnInit {
  constructor(
    private facultyservice: FacultyService,
    private orgCategoryService: OrgCategoryService,
    public modal: ModalService,
    public helperService: HelperService,
    private router: Router
  ) {}

  // Data
  dataRow: any[] = [];
  dataLoadProgress = false;
  successmessage = '';

  // Filters
  categories: any[] = [];
  subCategoryOptions: any[] = [];
  selectedCategoryId: number | null = null;
  selectedSubCategoryId: number | null = null;

  // Tabs: '' = All, 'APPROVED' = Accepted, 'REJECTED' = Rejected
  activeTab: string = '';

  // Pagination
  pageSize = 15;
  currentPage = 1;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.dataRow.length / this.pageSize));
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.dataRow.slice(start, start + this.pageSize);
  }

  get visiblePages(): (number | string)[] {
    const total = this.totalPages;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | string)[] = [1];
    if (this.currentPage > 3) pages.push('...');

    const start = Math.max(2, this.currentPage - 1);
    const end = Math.min(total - 1, this.currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (this.currentPage < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  }

  // Modal
  isOpen = false;
  modelItem: any;
  currentStatus = '';
  statusComment = '';
  statuscommentbtnclick = false;

  // Row expand
  selectedRowIndex: number | null = null;

  ngOnInit() {
    if (this.helperService.IsSuperAdmin()) {
      this.loadCategories();
    } else if (this.helperService.IsCategoryAdmin()) {
      this.selectedCategoryId = this.helperService.getOrgCategoryId();
      this.loadSubCategoriesForAdmin();
    }
    this.getRegistrationData();
  }

  loadCategories() {
    this.orgCategoryService.getCategories().subscribe({
      next: (cats) => (this.categories = cats),
      error: (err) => console.log(err),
    });
  }

  loadSubCategoriesForAdmin() {
    this.subCategoryOptions = this.helperService.getCategoryAdminSubCategories();
  }

  onCategoryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCategoryId = value ? +value : null;
    this.selectedSubCategoryId = null;
    const cat = this.categories.find((c) => c.id == this.selectedCategoryId);
    this.subCategoryOptions = cat ? cat.subCategories : [];
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.currentPage = 1;
    this.getRegistrationData();
  }

  applyFilter() {
    this.currentPage = 1;
    this.getRegistrationData();
  }

  getRegistrationData() {
    this.dataLoadProgress = true;
    this.dataRow = [];
    this.selectedRowIndex = null;
    this.facultyservice
      .getRegistrationList(
        this.activeTab,
        this.selectedCategoryId,
        this.selectedSubCategoryId
      )
      .subscribe({
        next: (res: any[]) => {
          this.dataRow = res;
          this.dataLoadProgress = false;
        },
        error: (err) => {
          console.log(err);
          this.dataLoadProgress = false;
        },
      });
  }

  changePage(page: number | string) {
    const p = +page;
    if (p < 1 || p > this.totalPages) return;
    this.currentPage = p;
  }

  getStatusLabel(status: string): string {
    if (status === 'APPROVED') return 'Accepted';
    if (status === 'REJECTED') return 'Rejected';
    if (status === 'Registered') return 'Pending';
    return 'Pending';
  }

  getStatusClass(status: string): string {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    if (status === 'APPROVED') return `${base} bg-green-100 text-green-800`;
    if (status === 'REJECTED') return `${base} bg-red-100 text-red-800`;
    return `${base} bg-yellow-100 text-yellow-800`;
  }

  openModal(row: any, status: string) {
    this.currentStatus = status;
    this.modelItem = row;
    this.isOpen = true;
    this.statuscommentbtnclick = false;
    this.statusComment = '';
  }

  closeModal() {
    this.modelItem = null;
    this.isOpen = false;
    this.statusComment = '';
    this.statuscommentbtnclick = false;
  }

  postStatus(row: any) {
    this.statuscommentbtnclick = true;
    if (!this.statusComment) return;
    this.updateStatus(row, this.currentStatus, this.statusComment);
  }

  updateStatus(row: any, status: string, comment: string) {
    const doUpdate = () => {
      this.facultyservice
        .updateRegistrationRecordStatus({ id: row.id, status, comment })
        .subscribe({
          next: () => {
            this.closeModal();
            this.successmessage = 'Status updated successfully.';
            this.getRegistrationData();
            setTimeout(() => (this.successmessage = ''), 5000);
          },
          error: (err: any) => console.log(err),
        });
    };

    if (!comment) {
      if (confirm(`Change status to ${status}?`)) doUpdate();
    } else {
      doUpdate();
    }
  }

  toggleRowActions(index: number) {
    this.selectedRowIndex = this.selectedRowIndex === index ? null : index;
  }

  downloadExcel() {
    this.facultyservice
      .exportRegistrations(
        this.activeTab,
        this.selectedCategoryId,
        this.selectedSubCategoryId
      )
      .subscribe({
        next: (response) => {
          const blob = response.body!;
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'MT_AT_CT_Registrations.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => console.log(err),
      });
  }
}
