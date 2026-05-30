import { Component, OnInit } from '@angular/core';
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

  adminForm!: FormGroup;
  categoryOptions: any[] = [];
  selectedCategory = '';
  errormessage = '';
  successmessage = '';

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
      orgCategory: ['', Validators.required],
      password: [{ value: this.generatePassword(), disabled: true }]
    });

    this.loadCategories();
  }

  loadCategories() {
    this.orgCategoryService.getCategories().subscribe({
      next: (res: any[]) => {
        this.categoryOptions = res
          .filter(c => c.isActive)
          .map(c => ({ value: c.value, label: c.label }));
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
    this.adminForm.controls['orgCategory'].setValue(value);
  }

  onSubmit() {
    this.adminForm.markAllAsTouched();
    if (this.adminForm.invalid) return;

    const payload = {
      ...this.adminForm.getRawValue()
    };

    this.categoryAdminService.createAdmin(payload).subscribe({
      next: () => {
        this.successmessage = 'Category admin created successfully.';
        setTimeout(() => {
          this.successmessage = '';
          this.router.navigate(['/categoryadmins']);
        }, 3000);
      },
      error: (err: any) => {
        this.errormessage = 'Failed to create admin. ' + (err?.error || '');
        setTimeout(() => this.errormessage = '', 4000);
      }
    });
  }

  cancel() {
    this.router.navigate(['/categoryadmins']);
  }
}
