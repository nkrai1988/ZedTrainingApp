import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authbaseInterceptor } from './core/authbase.interceptor';
import { httperrorbaseInterceptor } from './core/httperrorbase.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authbaseInterceptor,httperrorbaseInterceptor])),
    provideRouter(routes)]
};
