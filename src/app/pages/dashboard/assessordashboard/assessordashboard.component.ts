// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-assessordashboard',
//   imports: [],
//   templateUrl: './assessordashboard.component.html',
//   styleUrl: './assessordashboard.component.css',
// })
// export class AssessordashboardComponent {

// }
import { Component } from '@angular/core';
import { EcommerceMetricsComponent } from '../../../shared/components/ecommerce/ecommerce-metrics/ecommerce-metrics.component';
import { MonthlySalesChartComponent } from '../../../shared/components/ecommerce/monthly-sales-chart/monthly-sales-chart.component';
import { MonthlyTargetComponent } from '../../../shared/components/ecommerce/monthly-target/monthly-target.component';
import { StatisticsChartComponent } from '../../../shared/components/ecommerce/statics-chart/statics-chart.component';
import { DemographicCardComponent } from '../../../shared/components/ecommerce/demographic-card/demographic-card.component';
import { RecentOrdersComponent } from '../../../shared/components/ecommerce/recent-orders/recent-orders.component';
import { CertificationMetricsComponent } from '../../../shared/components/ecommerce/certification-metrics/certification-metrics.component';

@Component({
  selector: 'app-assessordashboard',
  imports: [
    EcommerceMetricsComponent,
    MonthlySalesChartComponent,
    MonthlyTargetComponent,
    StatisticsChartComponent,
    DemographicCardComponent,
    RecentOrdersComponent,
    CertificationMetricsComponent
  ],
  templateUrl: './assessordashboard.component.html',
})
export class AssessordashboardComponent {}
