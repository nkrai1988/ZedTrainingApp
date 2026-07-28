import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { CategoryAdminService } from '../../../services/category-admin.service';
import { OrgCategoryService } from '../../../services/org-category.service';

@Component({
  selector: 'app-category-admin-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentCardComponent,
    LabelComponent,
    SelectComponent,
    ButtonComponent,
    AlertComponent
  ],
  templateUrl: './category-admin-form.component.html',
  styleUrl: './category-admin-form.component.css'
})
export class CategoryAdminFormComponent implements OnInit {

  @ViewChild('subCatDropdown') subCatDropdownRef!: ElementRef;

  adminForm!: FormGroup;
  categoryOptions: any[] = [];
  subCategoryOptions: any[] = [];
  selectedSubCategoryIds: number[] = [];
  isSubCatDropdownOpen = false;
  private allCategories: any[] = [];
  selectedCategory = '';
  errormessage = '';
  successmessage = '';
  isSubmitting = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.subCatDropdownRef && !this.subCatDropdownRef.nativeElement.contains(event.target)) {
      this.isSubCatDropdownOpen = false;
    }
  }

  constructor(
    private fb: FormBuilder,
    private categoryAdminService: CategoryAdminService,
    private orgCategoryService: OrgCategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.adminForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      mobile: ['', [Validators.required, Validators.maxLength(20)]],
      aadharNo: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      orgCategoryId: [null, Validators.required],
      password: [{ value: this.generatePassword(), disabled: true }]
    });

    this.loadCategories();
  }

  loadCategories() {
    this.orgCategoryService.getCategories().subscribe({
      next: (res: any[]) => {
        this.allCategories = res.filter(c => c.isActive);
        this.categoryOptions = this.allCategories.map(c => ({ value: String(c.id), label: c.label }));
      }
    });
  }

  generatePassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  regeneratePassword() {
    this.adminForm.controls['password'].setValue(this.generatePassword());
  }

  handleCategoryChange(value: string) {
    this.selectedCategory = value;
    this.adminForm.controls['orgCategoryId'].setValue(Number(value));
    this.selectedSubCategoryIds = [];
    this.isSubCatDropdownOpen = false;
    const cat = this.allCategories.find(c => String(c.id) === value);
    this.subCategoryOptions = cat?.subCategories
      ?.filter((s: any) => s.isActive)
      .map((s: any) => ({ id: s.id, label: s.label })) ?? [];
  }

  toggleSubCatDropdown() {
    if (this.subCategoryOptions.length > 0) {
      this.isSubCatDropdownOpen = !this.isSubCatDropdownOpen;
    }
  }

  getSelectedSubCategoryLabels(): string[] {
    return this.subCategoryOptions
      .filter(s => this.selectedSubCategoryIds.includes(s.id))
      .map(s => s.label);
  }

  removeSubCategory(id: number, event: MouseEvent) {
    event.stopPropagation();
    this.selectedSubCategoryIds = this.selectedSubCategoryIds.filter(x => x !== id);
  }

  toggleSubCategory(id: number) {
    const idx = this.selectedSubCategoryIds.indexOf(id);
    if (idx === -1) {
      this.selectedSubCategoryIds = [...this.selectedSubCategoryIds, id];
    } else {
      this.selectedSubCategoryIds = this.selectedSubCategoryIds.filter(x => x !== id);
    }
  }

  isSubCategorySelected(id: number): boolean {
    return this.selectedSubCategoryIds.includes(id);
  }

  onSubmit() {
    this.adminForm.markAllAsTouched();
    if (this.adminForm.invalid) return;

    if (this.selectedSubCategoryIds.length === 0) {
      this.errormessage = 'Please select at least one sub-category.';
      setTimeout(() => this.errormessage = '', 4000);
      return;
    }

    const payload = {
      ...this.adminForm.getRawValue(),
      orgSubCategoryIds: this.selectedSubCategoryIds
    };

    this.isSubmitting = true;
    this.categoryAdminService.createAdmin(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.successmessage = 'Category admin created successfully.';
        setTimeout(() => {
          this.successmessage = '';
          this.router.navigate(['/categoryadmins']);
        }, 3000);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.errormessage = 'Failed to create admin. ' + (err?.error || '');
        setTimeout(() => this.errormessage = '', 4000);
      }
    });
  }

  cancel() {
    this.router.navigate(['/categoryadmins']);
  }
}
