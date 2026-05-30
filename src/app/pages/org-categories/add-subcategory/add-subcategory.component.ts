import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { OrgCategoryService } from '../../../services/org-category.service';

@Component({
  selector: 'app-add-subcategory',
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
  templateUrl: './add-subcategory.component.html',
  styleUrl: './add-subcategory.component.css'
})
export class AddSubcategoryComponent implements OnInit {

  subCategoryForm!: FormGroup;
  categoryOptions: any[] = [];
  selectedCategoryId = '';
  errormessage = '';
  successmessage = '';

  constructor(
    private fb: FormBuilder,
    private orgCategoryService: OrgCategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subCategoryForm = this.fb.group({
      categoryId: ['', Validators.required],
      value: ['', [Validators.required, Validators.maxLength(100)]],
      label: ['', [Validators.required, Validators.maxLength(100)]]
    });

    this.loadCategories();
  }

  loadCategories() {
    this.orgCategoryService.getCategories().subscribe({
      next: (res: any[]) => {
        this.categoryOptions = res
          .filter(c => c.isActive)
          .map(c => ({ value: String(c.id), label: c.label }));
      }
    });
  }

  handleCategoryChange(value: string) {
    this.selectedCategoryId = value;
    this.subCategoryForm.controls['categoryId'].setValue(value);
  }

  clearForm() {
    this.subCategoryForm.reset();
    this.selectedCategoryId = '';
  }

  onSubmit() {
    this.subCategoryForm.markAllAsTouched();
    if (this.subCategoryForm.invalid) return;

    const { categoryId, value, label } = this.subCategoryForm.value;

    this.orgCategoryService.addSubCategory(Number(categoryId), { value, label }).subscribe({
      next: () => {
        this.successmessage = 'Sub-category added successfully.';
        setTimeout(() => {
          this.successmessage = '';
          this.router.navigate(['/orgcategories']);
        }, 3000);
      },
      error: (err: any) => {
        this.errormessage = 'Failed to add sub-category. ' + (err?.error || '');
        setTimeout(() => this.errormessage = '', 4000);
      }
    });
  }

  cancel() {
    this.router.navigate(['/orgcategories']);
  }
}
