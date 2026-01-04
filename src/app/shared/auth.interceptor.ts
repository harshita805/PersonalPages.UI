import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, finalize, throwError } from 'rxjs';
import { LoaderService } from './loader.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const token = localStorage.getItem('token');
    const loader = inject(LoaderService);

    if (token) {
        req = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
    }

    loader.show();

    return next(req).pipe(
        catchError(err => {
            if (err.status === 401) {
                auth.logout();
            }
            return throwError(() => err);
        }),
        finalize(() => { loader.hide(); })
    );
};
