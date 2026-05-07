import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { Place } from '../../../shared/models/place.model';
@Component({
  selector: 'app-place-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './place-card.html',
  styleUrl: './place-card.css',
})
export class PlaceCard {
  @Input() place!: Place;

  @Output() toggleFavorite = new EventEmitter<any>();

  private authService = inject(AuthService);
  private favoriteService = inject(FavoriteService);
  private router = inject(Router);

  onToggleFavoriteClick(event: Event) {
    event.stopPropagation();

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Obtener el ID de ambas formas
    const placeId = this.place.id;

    if (!placeId) {
      console.error('No se encontró el ID del lugar', this.place);
      return;
    }

    this.favoriteService.toggleFavorite(placeId).subscribe({
      next: (res) => {
        // Se crea un nuevo objeto para que Angular detecte el cambio de referencia
        this.place = {
          ...this.place,
          isFavorite: res.isFavorite,
        };

        // Emitimos este nuevo objeto al padre
        this.toggleFavorite.emit(this.place);
      },
      error: (err) => console.error('Error al marcar favorito', err),
    });
  }
}
