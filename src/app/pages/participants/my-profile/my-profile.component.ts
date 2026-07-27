import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantProfile, ParticipantService } from '../../../services/participant.service';
import { AppFooterComponent } from '../../../shared/components/common/app-footer/app-footer.component';

@Component({
  selector: 'app-my-profile',
  imports: [CommonModule, AppFooterComponent],
  templateUrl: './my-profile.component.html',
})
export class MyProfileComponent implements OnInit {

  profile: ParticipantProfile = {
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    aadhaarNumber: '',
    panNumber: '',
    dateOfBirth: '',
    address: '',
    pinCode: '',
    orgCategory: '',
  };

  isLoading = true;
  errorMessage = '';

  constructor(private participantService: ParticipantService) {}

  ngOnInit(): void {
    this.participantService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load profile. Please try again.';
        this.isLoading = false;
      },
    });
  }

  get fullName(): string {
    return `${this.profile.firstName} ${this.profile.lastName}`.trim();
  }

  get initials(): string {
    const f = this.profile.firstName?.[0] ?? '';
    const l = this.profile.lastName?.[0] ?? '';
    return (f + l).toUpperCase() || '?';
  }
}
