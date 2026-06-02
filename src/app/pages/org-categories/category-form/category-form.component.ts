import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { OrgCategoryService } from '../../../services/org-category.service';

@Component({
  selector: 'app-category-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentCardComponent,
    LabelComponent,
    ButtonComponent,
    AlertComponent
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent implements OnInit {

  categoryForm!: FormGroup;
  errormessage = '';
  successmessage = '';
  selectedLogoFile: File | null = null;
  logoPreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private orgCategoryService: OrgCategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.categoryForm = this.fb.group({
      value: ['', [Validators.required, Validators.maxLength(100)]],
      label: ['', [Validators.required, Validators.maxLength(100)]],
      subCategories: this.fb.array([this.createSubCategoryGroup()])
    });
  }

  get subCategories(): FormArray {
    return this.categoryForm.get('subCategories') as FormArray;
  }

  createSubCategoryGroup(): FormGroup {
    return this.fb.group({
      value: ['', [Validators.required, Validators.maxLength(100)]],
      label: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  addSubCategory() {
    this.subCategories.push(this.createSubCategoryGroup());
  }

  removeSubCategory(index: number) {
    if (this.subCategories.length > 1) {
      this.subCategories.removeAt(index);
    }
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
    this.logoPreviewUrl = null;
    logoInput.value = '';
  }

  clearForm() {
    this.categoryForm.reset();
    while (this.subCategories.length > 1) {
      this.subCategories.removeAt(1);
    }
    this.subCategories.at(0).reset();
    this.selectedLogoFile = null;
    this.logoPreviewUrl = null;
  }

  onSubmit() {
    this.categoryForm.markAllAsTouched();
    if (this.categoryForm.invalid) return;

    this.orgCategoryService.saveCategory(this.categoryForm.value).subscribe({
      next: (res: any) => {
        if (this.selectedLogoFile && res?.id) {
          this.orgCategoryService.uploadLogo(res.id, this.selectedLogoFile).subscribe({
            next: () => this.finishSuccess(),
            error: () => {
              this.successmessage = 'Category created but logo upload failed.';
              setTimeout(() => { this.successmessage = ''; this.router.navigate(['/orgcategories']); }, 3000);
            }
          });
        } else {
          this.finishSuccess();
        }
      },
      error: (err: any) => {
        this.errormessage = 'Failed to create category. ' + (err?.error || '');
        setTimeout(() => this.errormessage = '', 4000);
      }
    });
  }

  private finishSuccess() {
    this.successmessage = 'Category created successfully.';
    setTimeout(() => {
      this.successmessage = '';
      this.router.navigate(['/orgcategories']);
    }, 3000);
  }

  cancel() {
    this.router.navigate(['/orgcategories']);
  }
}
