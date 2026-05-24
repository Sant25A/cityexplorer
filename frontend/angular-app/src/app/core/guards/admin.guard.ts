import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notify = inject(NotificationService);

  // Evaluamos de inmediato la Signal reactiva
  if (authService.isAdmin()) {
    return true;
  }

  notify.error('Acceso denegado: Se requieren permisos de administrador');
  router.navigate(['/']);
  return false;
};