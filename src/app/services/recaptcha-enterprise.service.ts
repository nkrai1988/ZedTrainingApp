import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

declare const grecaptcha: any;

@Injectable({ providedIn: 'root' })
export class RecaptchaEnterpriseService {

  private isReady = false;
  private pendingCallbacks: (() => void)[] = [];

  constructor() {
    this.waitForReady();
  }

  private waitForReady() {
    const check = () => {
      if (typeof grecaptcha !== 'undefined' && grecaptcha.enterprise) {
        grecaptcha.enterprise.ready(() => {
          this.isReady = true;
          this.pendingCallbacks.forEach(cb => cb());
          this.pendingCallbacks = [];
        });
      } else {
        setTimeout(check, 150);
      }
    };
    check();
  }

  private whenReady(callback: () => void) {
    if (this.isReady) {
      callback();
    } else {
      this.pendingCallbacks.push(callback);
    }
  }

  render(
    container: HTMLElement,
    onToken: (token: string) => void,
    onExpired: () => void
  ): void {
    this.whenReady(() => {
      try {
        grecaptcha.enterprise.render(container, {
          sitekey: environment.recaptchaSiteKey,
          action: 'LOGIN',
          callback: onToken,
          'expired-callback': onExpired,
          'error-callback': () => onExpired()
        });
      } catch {
        // widget already rendered in this container — ignore
      }
    });
  }

  reset(): void {
    try {
      if (typeof grecaptcha !== 'undefined' && grecaptcha.enterprise) {
        grecaptcha.enterprise.reset();
      }
    } catch { }
  }
}
