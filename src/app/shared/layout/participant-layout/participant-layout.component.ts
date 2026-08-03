import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { ParticipantSidebarComponent } from '../participant-sidebar/participant-sidebar.component';
import { BackdropComponent } from '../backdrop/backdrop.component';
import { ParticipantHeaderComponent } from '../participant-header/participant-header.component';
import { AppFooterComponent } from '../../components/common/app-footer/app-footer.component';

@Component({
  selector: 'app-participant-layout',
  imports: [
    CommonModule,
    RouterModule,
    ParticipantSidebarComponent,
    BackdropComponent,
    ParticipantHeaderComponent,
    AppFooterComponent,
  ],
  templateUrl: './participant-layout.component.html',
})
export class ParticipantLayoutComponent {
  readonly isExpanded$;
  readonly isHovered$;
  readonly isMobileOpen$;

  constructor(public sidebarService: SidebarService) {
    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isHovered$ = this.sidebarService.isHovered$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }
}
