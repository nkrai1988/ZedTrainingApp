import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const httperrorbaseInterceptor: HttpInterceptorFn = (req, next) => {
  let router = inject(Router)
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => { 
      console.log({'error1':error});
      if(error && error.status && error.status == 401){
        router.navigate(['/signin']);
      }
      console.log({'error2':error});
      return throwError(()=> error);
    })
  );
};
