import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { CountryMapComponent } from '../../../shared/components/ecommerce/country-map/country-map.component';
import { DashboardService } from '../../../services/dashboard.service';
import { HelperService } from '../../../services/helper.service';

@Component({
  selector: 'app-category-admin-dashboard',
  imports: [CommonModule, SelectComponent, CountryMapComponent],
  templateUrl: './category-admin-dashboard.component.html',
})
export class CategoryAdminDashboardComponent implements OnInit, OnDestroy {
  constructor(private dashboardService: DashboardService, private helper: HelperService) {}

  allStates: any[] = [];
  locationData: any[] = [];
  loadMap = false;
  dataLoadProgress = false;

  programmesConducted = 0;
  activeParticipants = 0;
  approvedAgencies = 0;
  pendingAgencies = 0;
  certifiedExperts = 0;

  selectedState = 'All';
  selectedSubCategoryId: number | null = null;

  private subCategorySub: Subscription = new Subscription();

  ngOnInit() {
    this.loadStates();
    this.subCategorySub = this.helper.subCategory$.subscribe(id => {
      this.selectedSubCategoryId = id;
      this.loadStats();
    });
  }

  ngOnDestroy() {
    this.subCategorySub.unsubscribe();
  }

  loadStates() {
    this.dashboardService.getCategoryAdminStates().subscribe({
      next: (response: string[]) => {
        this.allStates = response.map(x => ({ value: x, label: x }));
        this.allStates.unshift({ value: 'All', label: 'All States & Territories' });
      }
    });
  }

  loadStats() {
    this.loadMap = false;
    this.dataLoadProgress = true;
    this.programmesConducted = 0;
    this.activeParticipants = 0;
    this.approvedAgencies = 0;
    this.certifiedExperts = 0;

    this.dashboardService.getCategoryAdminStats(this.selectedState, this.selectedSubCategoryId).subscribe({
      next: (response: any) => {
        this.programmesConducted = response.programmesConducted;
        this.activeParticipants = response.activeParticipants;
        this.approvedAgencies = response.approvedAgencies;
        this.pendingAgencies = response.pendingAgencies;
        this.certifiedExperts = response.certifiedExperts;
        this.locationData = response.locations;
        this.loadMap = true;
        this.dataLoadProgress = false;
      },
      error: () => {
        this.loadMap = true;
        this.dataLoadProgress = false;
      }
    });
  }

  applyFilters() {
    this.loadStats();
  }

  handleStateChange(value: string) {
    this.selectedState = value;
  }
}
