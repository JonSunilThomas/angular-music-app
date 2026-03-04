import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);
  const snackBar = inject(MatSnackBar);

  // Only show loading spinner for GET requests (not background PATCH/POST)
  const isRead = req.method === 'GET';
  if (isRead) loading.show();

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred';

      if (error.status === 0) {
        message = 'Cannot connect to server. Is json-server running?';
      } else if (error.status === 404) {
        message = 'Resource not found';
      } else if (error.status >= 500) {
        message = 'Server error. Please try again later.';
      }

      snackBar.open(message, 'Dismiss', {
        duration: 4000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });

      return throwError(() => error);
    }),
    finalize(() => { if (isRead) loading.hide(); })
  );
};
