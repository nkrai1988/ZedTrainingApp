import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HelperService } from '../services/helper.service';

export const authbaseInterceptor: HttpInterceptorFn = (req, next) => {
  let token = localStorage.getItem('authToken');

  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  if (!(req.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  return next(req.clone({ setHeaders: headers }));
};
