import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error) => {
            console.error('Error HTTP:', error);

            if (error.status === 401) {
                console.warn('No autorizado - token inválido o expirado');
                // localStorage.removeItem('token');
            }

            if (error.status === 500) {
                console.warn('Error del servidor');
            }

            return throwError(() => error);
        })
    );
};