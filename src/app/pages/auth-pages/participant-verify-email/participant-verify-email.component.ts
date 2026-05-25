import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';

@Component({
  selector: 'app-participant-verify-email',
  imports: [CommonModule, RouterModule, AuthPageLayoutComponent],
  templateUrl: './participant-verify-email.component.html',
})
export class ParticipantVerifyEmailComponent implements OnInit {
  status: 'loading' | 'success' | 'error' = 'loading';
  message = '';
  countdown = 5;
  private timer: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.status = 'error';
      this.message = 'Invalid verification link. No token found.';
      return;
    }

    this.authService.verifyParticipantEmail(token).subscribe({
      next: (response: any) => {
        this.status = 'success';
        // this.message = typeof response === 'string'
        //   ? response
        //   : 'Email verified successfully! You can now sign in.';
        this.message = 'Email verified successfully! You can now sign in.';
        this.startCountdown();
      },
      error: (error) => {
        this.status = 'error';
        this.message = (error.error && typeof error.error === 'string')
          ? error.error
          : 'Verification failed. The link may have expired or already been used.';
      }
    });
  }

  private startCountdown() {
    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.timer);
        this.router.navigate(['/participant/signin']);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  goToSignIn() {
    this.router.navigate(['/participant/signin']);
  }

  goToSignUp() {
    this.router.navigate(['/participant/signup']);
  }
}
