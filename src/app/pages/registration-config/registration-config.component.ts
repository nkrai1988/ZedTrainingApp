import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { AlertComponent } from '../../shared/components/ui/alert/alert.component';
import { SelectComponent } from '../../shared/components/form/select/select.component';
import { LabelComponent } from '../../shared/components/form/label/label.component';
import { DataloadinprogressComponent } from '../../shared/components/common/dataloadinprogress/dataloadinprogress.component';
import { ModalComponent } from '../../shared/components/ui/modal/modal.component';
import { OrgCategoryService } from '../../services/org-category.service';
import { RegistrationStepConfigService } from '../../services/registration-step-config.service';

@Component({
  selector: 'app-registration-config',
  imports: [
    CommonModule,
    ComponentCardComponent,
    AlertComponent,
    SelectComponent,
    LabelComponent,
    DataloadinprogressComponent,
    ModalComponent
  ],
  templateUrl: './registration-config.component.html',
  styleUrl: './registration-config.component.css'
})
export class RegistrationConfigComponent implements OnInit {

  categories: any[] = [];
  categoryOptions: any[] = [];
  subCategoryOptions: any[] = [];

  selectedCategory = '';
  selectedSubCategory = '';

  steps: any[] = [];
  stepsLoading = false;
  successmessage = '';
  errormessage = '';

  previewStep: any = null;
  previewOpen = false;

  openPreview(step: any) {
    this.previewStep = step;
    this.previewOpen = true;
  }

  closePreview() {
    this.previewOpen = false;
    this.previewStep = null;
  }

  constructor(
    private orgCategoryService: OrgCategoryService,
    private stepConfigService: RegistrationStepConfigService
  ) {}

  ngOnInit() {
    this.orgCategoryService.getCategories().subscribe({
      next: (res: any[]) => {
        this.categories = res.filter(c => c.isActive);
        this.categoryOptions = this.categories.map(c => ({ value: c.value, label: c.label }));
      }
    });
  }

  handleCategoryChange(value: string) {
    this.selectedCategory = value;
    this.selectedSubCategory = '';
    this.steps = [];

    const cat = this.categories.find(c => c.value === value);
    this.subCategoryOptions = (cat?.subCategories ?? [])
      .filter((s: any) => s.isActive)
      .map((s: any) => ({ value: s.value, label: s.label }));
  }

  handleSubCategoryChange(value: string) {
    this.selectedSubCategory = value;
    this.loadSteps();
  }

  loadSteps() {
    if (!this.selectedCategory || !this.selectedSubCategory) return;
    this.stepsLoading = true;
    this.stepConfigService.getStepsForAdmin(this.selectedCategory, this.selectedSubCategory).subscribe({
      next: (res: any[]) => {
        this.steps = res;
        this.stepsLoading = false;
      },
      error: () => { this.stepsLoading = false; }
    });
  }

  toggle(step: any) {
    if (step.key === 'declaration') return;

    const newValue = !step.isEnabled;
    this.stepConfigService.toggleStep(step.key, this.selectedCategory, this.selectedSubCategory, newValue).subscribe({
      next: () => {
        step.isEnabled = newValue;
        this.successmessage = `"${step.name}" ${newValue ? 'enabled' : 'disabled'} for ${this.selectedCategory} / ${this.selectedSubCategory}.`;
        setTimeout(() => this.successmessage = '', 4000);
      },
      error: (err: any) => {
        this.errormessage = err?.error || 'Failed to update step.';
        setTimeout(() => this.errormessage = '', 4000);
      }
    });
  }
}
