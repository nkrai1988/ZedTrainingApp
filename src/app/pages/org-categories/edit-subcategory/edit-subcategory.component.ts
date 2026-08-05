import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { OrgCategoryService } from '../../../services/org-category.service';

@Component({
  selector: 'app-edit-subcategory',
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
  templateUrl: './edit-subcategory.component.html',
  styleUrl: './edit-subcategory.component.css'
})
export class EditSubcategoryComponent implements OnInit {

  subCategoryForm!: FormGroup;
  subCategoryId!: number;
  errormessage = '';
  successmessage = '';
  isSubmitting = false;
  isLoading = true;

  currentSequenceName = '';
  currentPrefix = '';
  selectedTemplateFile: File | null = null;
  currentTemplatePath = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private orgCategoryService: OrgCategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subCategoryId = Number(this.route.snapshot.paramMap.get('id'));

    this.subCategoryForm = this.fb.group({
      value:         ['', [Validators.required, Validators.maxLength(100)]],
      label:         ['', [Validators.required, Validators.maxLength(100)]],
      requiresMCQ:   [true],
      mScoreDivisor: [null]
    });

    this.loadSubCategory();
  }

  loadSubCategory() {
    this.orgCategoryService.getSubCategory(this.subCategoryId).subscribe({
      next: (sub: any) => {
        this.currentSequenceName = sub.certificateSequenceName ?? '';
        this.currentPrefix       = sub.certificatePrefix ?? '';
        this.currentTemplatePath = sub.certificateTemplatePath ?? '';

        this.subCategoryForm.patchValue({
          value:         sub.value,
          label:         sub.label,
          requiresMCQ:   sub.requiresMCQ ?? false,
          mScoreDivisor: sub.mScoreDivisor ?? null
        });

        this.isLoading = false;
      },
      error: () => {
        this.errormessage = 'Failed to load sub-category.';
        this.isLoading = false;
      }
    });
  }

  onTemplateFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedTemplateFile = input.files?.[0] ?? null;
  }

  onSubmit() {
    this.subCategoryForm.markAllAsTouched();
    if (this.subCategoryForm.invalid) return;

    const v = this.subCategoryForm.value;
    const body = {
      value:         v.value,
      label:         v.label,
      requiresMCQ:   v.requiresMCQ ?? false,
      mScoreDivisor: v.mScoreDivisor ? Number(v.mScoreDivisor) : null
    };

    this.isSubmitting = true;
    this.orgCategoryService.updateSubCategory(this.subCategoryId, body).subscribe({
      next: () => {
        if (this.selectedTemplateFile) {
          this.orgCategoryService.uploadSubCategoryTemplate(this.subCategoryId, this.selectedTemplateFile).subscribe({
            next: (res: any) => {
              this.currentTemplatePath = res.certificateTemplatePath ?? '';
              this.finishUpdate();
            },
            error: () => {
              this.isSubmitting = false;
              window.scrollTo({ top: 0, behavior: 'smooth' });
              this.errormessage = 'Sub-category saved but template upload failed.';
              setTimeout(() => this.errormessage = '', 4000);
            }
          });
        } else {
          this.finishUpdate();
        }
      },
      error: (err: any) => {
        this.isSubmitting = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.errormessage = 'Failed to update sub-category. ' + (err?.error || '');
        setTimeout(() => this.errormessage = '', 4000);
      }
    });
  }

  private finishUpdate() {
    this.isSubmitting = false;
    this.selectedTemplateFile = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.successmessage = 'Sub-category updated successfully.';
    setTimeout(() => {
      this.successmessage = '';
      this.router.navigate(['/orgcategories']);
    }, 3000);
  }

  cancel() {
    this.router.navigate(['/orgcategories']);
  }
}
