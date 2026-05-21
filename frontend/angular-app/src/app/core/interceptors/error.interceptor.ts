import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    return next(req).pipe(
        catchError((error) => {
            console.error('Error HTTP:', error);

            // Token expirado o inválido
            if (error.status === 401) {
                console.warn('No autorizado - token inválido o expirado');

                // Limpiar la sesión
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                // Redirigir al login
                router.navigate(['/login']);
            }

            if (error.status === 500) {
                console.warn('Error del servidor');
            }

            return throwError(() => error);
        })
    );
};