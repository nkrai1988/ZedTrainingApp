import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SidebarService } from '../../services/sidebar.service';
import { HelperService } from '../../../services/helper.service';

type ParticipantNavItem = {
  name: string;
  path: string;
  icon: SafeHtml;
  temp?: boolean;
};

@Component({
  selector: 'app-participant-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './participant-sidebar.component.html',
})
export class ParticipantSidebarComponent {

  readonly isExpanded$;
  readonly isMobileOpen$;
  readonly isHovered$;

  navItems: ParticipantNavItem[] = [];

  private readonly rawNavItems = [
    {
      name: 'Dashboard',
      path: '/participantdashboard',
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 3.25C4.25736 3.25 3.25 4.25736 3.25 5.5V8.99998C3.25 10.2426 4.25736 11.25 5.5 11.25H9C10.2426 11.25 11.25 10.2426 11.25 8.99998V5.5C11.25 4.25736 10.2426 3.25 9 3.25H5.5ZM4.75 5.5C4.75 5.08579 5.08579 4.75 5.5 4.75H9C9.41421 4.75 9.75 5.08579 9.75 5.5V8.99998C9.75 9.41419 9.41421 9.74998 9 9.74998H5.5C5.08579 9.74998 4.75 9.41419 4.75 8.99998V5.5ZM5.5 12.75C4.25736 12.75 3.25 13.7574 3.25 15V18.5C3.25 19.7426 4.25736 20.75 5.5 20.75H9C10.2426 20.75 11.25 19.7427 11.25 18.5V15C11.25 13.7574 10.2426 12.75 9 12.75H5.5ZM4.75 15C4.75 14.5858 5.08579 14.25 5.5 14.25H9C9.41421 14.25 9.75 14.5858 9.75 15V18.5C9.75 18.9142 9.41421 19.25 9 19.25H5.5C5.08579 19.25 4.75 18.9142 4.75 18.5V15ZM12.75 5.5C12.75 4.25736 13.7574 3.25 15 3.25H18.5C19.7426 3.25 20.75 4.25736 20.75 5.5V8.99998C20.75 10.2426 19.7426 11.25 18.5 11.25H15C13.7574 11.25 12.75 10.2426 12.75 8.99998V5.5ZM15 4.75C14.5858 4.75 14.25 5.08579 14.25 5.5V8.99998C14.25 9.41419 14.5858 9.74998 15 9.74998H18.5C18.9142 9.74998 19.25 9.41419 19.25 8.99998V5.5C19.25 5.08579 18.9142 4.75 18.5 4.75H15ZM15 12.75C13.7574 12.75 12.75 13.7574 12.75 15V18.5C12.75 19.7426 13.7574 20.75 15 20.75H18.5C19.7426 20.75 20.75 19.7427 20.75 18.5V15C20.75 13.7574 19.7426 12.75 18.5 12.75H15ZM14.25 15C14.25 14.5858 14.5858 14.25 15 14.25H18.5C18.9142 14.25 19.25 14.5858 19.25 15V18.5C19.25 18.9142 18.9142 19.25 18.5 19.25H15C14.5858 19.25 14.25 18.9142 14.25 18.5V15Z" fill="currentColor"/></svg>`,
    },
    {
      name: 'Apply/Register',
      path: '/register',
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 2.75A2.25 2.25 0 0 1 8.25 0.5h7.5A2.25 2.25 0 0 1 18 2.75v18.5A2.25 2.25 0 0 1 15.75 23.5h-7.5A2.25 2.25 0 0 1 6 21.25V2.75Zm2.25-.75a.75.75 0 0 0-.75.75v18.5c0 .414.336.75.75.75h7.5a.75.75 0 0 0 .75-.75V2.75a.75.75 0 0 0-.75-.75h-7.5ZM9 6.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 6.75Zm0 3.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 10.25Zm0 3.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5A.75.75 0 0 1 9 13.75Z" fill="currentColor"/></svg>`,
    },
    {
      name: 'My Programmes',
      path: '/participant/programmes',
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.25 4A.75.75 0 0 1 4 3.25h16A.75.75 0 0 1 20.75 4v1A.75.75 0 0 1 20 5.75H4A.75.75 0 0 1 3.25 5V4ZM3.25 9A.75.75 0 0 1 4 8.25h16A.75.75 0 0 1 20.75 9v1A.75.75 0 0 1 20 10.75H4A.75.75 0 0 1 3.25 10V9ZM4 13.25A.75.75 0 0 0 3.25 14v1A.75.75 0 0 0 4 15.75h10A.75.75 0 0 0 14.75 15v-1A.75.75 0 0 0 14 13.25H4ZM15.25 18a2.75 2.75 0 1 1 5.5 0 2.75 2.75 0 0 1-5.5 0Zm2.75-1.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z" fill="currentColor"/></svg>`,
    },
    {
      name: 'My Certificate',
      path: '/participant/certificates',
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.25 5.5C4.25 4.25736 5.25736 3.25 6.5 3.25H17.5C18.7426 3.25 19.75 4.25736 19.75 5.5V13.5C19.75 14.7426 18.7426 15.75 17.5 15.75H14.3107L14.9053 18.3295C15.0343 18.8793 14.8099 19.4512 14.3388 19.7634L12.5528 20.9106C12.2177 21.1298 11.7823 21.1298 11.4472 20.9106L9.66116 19.7634C9.19007 19.4512 8.96573 18.8793 9.09473 18.3295L9.68927 15.75H6.5C5.25736 15.75 4.25 14.7426 4.25 13.5V5.5ZM6.5 4.75C6.08579 4.75 5.75 5.08579 5.75 5.5V13.5C5.75 13.9142 6.08579 14.25 6.5 14.25H17.5C17.9142 14.25 18.25 13.9142 18.25 13.5V5.5C18.25 5.08579 17.9142 4.75 17.5 4.75H6.5ZM11.1907 15.75L10.5561 18.5138L12 19.3863L13.4439 18.5138L12.8093 15.75H11.1907Z" fill="currentColor"/></svg>`,
    },
    {
      name: 'My Profile',
      path: '/participant/profile',
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.75C9.10051 2.75 6.75 5.10051 6.75 8C6.75 10.8995 9.10051 13.25 12 13.25C14.8995 13.25 17.25 10.8995 17.25 8C17.25 5.10051 14.8995 2.75 12 2.75ZM5.25 8C5.25 4.27208 8.27208 1.25 12 1.25C15.7279 1.25 18.75 4.27208 18.75 8C18.75 11.7279 15.7279 14.75 12 14.75C8.27208 14.75 5.25 11.7279 5.25 8ZM6.5 17.25C4.42893 17.25 2.75 18.9289 2.75 21V22C2.75 22.4142 2.41421 22.75 2 22.75C1.58579 22.75 1.25 22.4142 1.25 22V21C1.25 18.1005 3.6005 15.75 6.5 15.75H17.5C20.3995 15.75 22.75 18.1005 22.75 21V22C22.75 22.4142 22.4142 22.75 22 22.75C21.5858 22.75 21.25 22.4142 21.25 22V21C21.25 18.9289 19.5711 17.25 17.5 17.25H6.5Z" fill="currentColor"/></svg>`,
    },
    {
      name: 'Change Password',
      path: '/participant/changepassword',
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.25 10.0546V8C5.25 4.27208 8.27208 1.25 12 1.25C15.7279 1.25 18.75 4.27208 18.75 8V10.0546C19.8648 10.1379 20.6532 10.3818 21.2374 10.9645C22.25 11.9742 22.25 13.5828 22.25 16.8C22.25 20.0172 22.25 21.6258 21.2374 22.6355C20.2248 23.6452 18.6116 23.6452 15.3853 23.6452H8.61469C5.38836 23.6452 3.77519 23.6452 2.76256 22.6355C1.75 21.6258 1.75 20.0172 1.75 16.8C1.75 13.5828 1.75 11.9742 2.76256 10.9645C3.34684 10.3818 4.13517 10.1379 5.25 10.0546ZM6.75 8C6.75 5.10051 9.10051 2.75 12 2.75C14.8995 2.75 17.25 5.10051 17.25 8V10.0036C16.867 10 16.4515 10 16 10H8C7.54849 10 7.13301 10 6.75 10.0036V8ZM12 14.25C12.4142 14.25 12.75 14.5858 12.75 15V18C12.75 18.4142 12.4142 18.75 12 18.75C11.5858 18.75 11.25 18.4142 11.25 18V15C11.25 14.5858 11.5858 14.25 12 14.25Z" fill="currentColor"/></svg>`,
    },
  ];

  constructor(
    public sidebarService: SidebarService,
    private helper: HelperService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
    this.isHovered$ = this.sidebarService.isHovered$;
    this.navItems = this.rawNavItems.map(item => ({
      ...item,
      icon: this.sanitizer.bypassSecurityTrustHtml(item.icon)
    }));
  }

  onSidebarMouseEnter() {
    if (!(this.sidebarService as any).isExpandedSubject?.value) {
      this.sidebarService.setHovered(true);
    }
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  logout() {
    this.helper.userLogOut();
  }

  onMobileClose() {
    this.sidebarService.setMobileOpen(false);
  }
}
